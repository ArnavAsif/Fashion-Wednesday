const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9455',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9455/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(id, method, params = {}) {
    return new Promise(res => {
      const h = msg => {
        const data = JSON.parse(msg.data);
        if (data.id === id) { ws.removeEventListener('message', h); res(data.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const res = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      const b = document.querySelector('.bracket');
      const root = document.querySelector('.marker-btn-root');
      return JSON.stringify({
        bracketTagName: b ? b.tagName : null,
        bracketClasses: b ? b.className : null,
        bracketDisplay: b ? window.getComputedStyle(b).display : null,
        rootClasses: root ? root.className : null,
        rootDisplay: root ? window.getComputedStyle(root).display : null,
        rootInlineStyle: root ? root.getAttribute('style') : null
      });
    })()`,
    returnByValue: true
  });
  console.log(res.result.value);
  chrome.kill();
  process.exit(0);
}
test();
