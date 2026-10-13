const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9499',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9499/json', r => {
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
      const btn = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent.includes('DETAILS'));
      const container = btn.querySelector('.marker-lottie-layer');
      const anim = container.__lottieAnim;
      anim.goToAndStop(18, true);
      const svg = container.querySelector('svg');
      return JSON.stringify({
        containerOuterHTML: container.outerHTML.slice(0, 400),
        containerRect: container.getBoundingClientRect(),
        svgRect: svg ? svg.getBoundingClientRect() : null,
        svgViewBox: svg ? svg.getAttribute('viewBox') : null,
        svgComputedStyle: svg ? {
          width: window.getComputedStyle(svg).width,
          height: window.getComputedStyle(svg).height,
          display: window.getComputedStyle(svg).display,
          opacity: window.getComputedStyle(svg).opacity,
          visibility: window.getComputedStyle(svg).visibility,
          transform: window.getComputedStyle(svg).transform
        } : null
      }, null, 2);
    })()`,
    returnByValue: true
  });
  console.log(res.result.value);

  chrome.kill();
  process.exit(0);
}
test();
