const { spawn } = require('child_process');
const http = require('http');

async function checkLottie() {
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
      const btnM = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent.includes('M'));
      const lottie = btnM.querySelector('.marker-lottie-layer');
      const svg = lottie ? lottie.querySelector('svg') : null;
      return JSON.stringify({
        lottieStyle: lottie ? window.getComputedStyle(lottie).cssText : null,
        lottieRect: lottie ? lottie.getBoundingClientRect() : null,
        svgRect: svg ? svg.getBoundingClientRect() : null,
        svgInnerHTML: svg ? svg.innerHTML.slice(0, 300) : null
      }, null, 2);
    })()`,
    returnByValue: true
  });
  console.log('Lottie debug:', res.result.value);

  chrome.kill();
  process.exit(0);
}
checkLottie();
