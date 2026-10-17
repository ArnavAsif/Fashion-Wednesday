const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testDesktop() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9320',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9320/json', r => {
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

  const aTop = await send(1, 'Runtime.evaluate', {
    expression: 'document.getElementById("arrivals").offsetTop',
    returnByValue: true
  }).then(r => r.result.value);

  console.log('Desktop arrivals top:', aTop);

  await send(2, 'Runtime.evaluate', {
    expression: `
      if (window.__lenis) window.__lenis.scrollTo(${aTop - 30}, { immediate: true });
      else window.scrollTo(0, ${aTop - 30});
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const snap = await send(3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/arrivals_desk.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/arrivals_desk.png');

  ws.close();
  chrome.kill();
}

testDesktop();
