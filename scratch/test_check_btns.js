const { spawn } = require('child_process');
const http = require('http');

async function check() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9477',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9477/json', r => {
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
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      return btns.map((b, idx) => ({
        idx,
        text: b.textContent.trim(),
        hasLottieSvg: !!b.querySelector('svg'),
        rect: b.getBoundingClientRect()
      }));
    })()`,
    returnByValue: true
  });
  console.log('Buttons on product page:', JSON.stringify(res.result.value, null, 2));

  chrome.kill();
  process.exit(0);
}
check();
