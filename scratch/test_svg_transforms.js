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
  const r = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      const btnM = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent.includes('DETAILS'));
      const anim = btnM.querySelector('.marker-lottie-layer').__lottieAnim;
      anim.goToAndStop(18, true);
      const svg = btnM.querySelector('svg');
      return Array.from(svg.querySelectorAll('g')).map(g => ({
        tag: g.tagName,
        id: g.id,
        transform: g.getAttribute('transform'),
        clipPath: g.getAttribute('clip-path'),
        opacity: g.getAttribute('opacity'),
        mask: g.getAttribute('mask')
      }));
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(r.result.value, null, 2));
  chrome.kill();
  process.exit(0);
}
run();
