const { spawn } = require('child_process');
const http = require('http');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9422', '--window-size=1600,1000', 'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9422/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  function send(id, method, params = {}) {
    return new Promise(res => {
      const h = msg => { const d = JSON.parse(msg.data); if (d.id === id) { ws.removeEventListener('message', h); res(d.result); }};
      ws.addEventListener('message', h); ws.send(JSON.stringify({ id, method, params }));
    });
  }
  for (const f of [0, 5, 10, 15, 20]) {
    const r = await send(f + 1, 'Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent.includes('DETAILS'));
        const anim = btn.querySelector('.marker-lottie-layer').__lottieAnim;
        anim.goToAndStop(${f}, true);
        const svg = btn.querySelector('svg');
        const box = svg.getBBox();
        return { frame: ${f}, x: box.x, y: box.y, width: box.width, height: box.height };
      })()`,
      returnByValue: true
    });
    console.log(r.result.value);
  }
  chrome.kill();
  process.exit(0);
}
run();
