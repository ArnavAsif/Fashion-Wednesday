const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9297',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 3500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9297/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  function send(id, method, params = {}) {
    return new Promise((resolve) => {
      const h = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === id) { ws.removeEventListener('message', h); resolve(data.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const res = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      function box(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        return {
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
          position: cs.position,
          backgroundColor: cs.backgroundColor,
          zIndex: cs.zIndex,
        };
      }
      return {
        header: box(document.querySelector('.site-header')),
        hero: box(document.querySelector('.hero-section')),
        list: box(document.querySelector('.hero-section__list')),
        card: box(document.querySelector('.hero-card')),
        imgBw: box(document.querySelector('.hero-card__img-bw')),
        imgColor: box(document.querySelector('.hero-card__img-color')),
        imgLine: box(document.querySelector('.hero-card__img-line')),
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
  chrome.kill();
}
test().catch(e => console.error(e));
