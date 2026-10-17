const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9298',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9298/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(id, method, params = {}) {
    return new Promise((resolve) => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send(1, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send(2, 'Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2000));

  const styles = await send(3, 'Runtime.evaluate', {
    expression: `
      (() => {
        const styleTags = Array.from(document.querySelectorAll('style')).map(s => s.textContent.slice(0, 100));
        const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
        const groupEl = document.querySelector('.arrivals-section__group');
        return {
          styleCount: styleTags.length,
          linkTags,
          groupElOuter: groupEl ? groupEl.outerHTML.slice(0, 200) : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Styles info:', JSON.stringify(styles.result.value, null, 2));

  ws.close();
  chrome.kill();
}
test();
