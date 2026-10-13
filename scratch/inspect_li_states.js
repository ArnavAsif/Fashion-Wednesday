const http = require('http');
const { spawn } = require('child_process');

function send(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9265',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9265/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const evalRes = await send(ws, 1, 'Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new CustomEvent('arrivals:next'));
      const lis = Array.from(document.querySelectorAll('.arrivals-section__group-swiper.one li'));
      lis.map((li, i) => ({
        index: i,
        className: li.className,
        dataDir: li.getAttribute('data-dir'),
        transform: window.getComputedStyle(li).transform,
        opacity: window.getComputedStyle(li).opacity,
        zIndex: window.getComputedStyle(li).zIndex,
        title: li.querySelector('.arrivals-card__title') ? li.querySelector('.arrivals-card__title').textContent : null
      }))
    `,
    returnByValue: true
  });

  console.log(JSON.stringify(evalRes.result.value, null, 2));

  ws.close();
  chrome.kill();
}
run().catch(console.error);
