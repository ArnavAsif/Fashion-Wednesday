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

async function inspectArrivals() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9230/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const res = await send(ws, 1, 'Runtime.evaluate', {
    expression: `(() => {
      function r(el) {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { top: Math.round(b.top), left: Math.round(b.left), width: Math.round(b.width), height: Math.round(b.height) };
      }
      const section = document.querySelector('#arrivals');
      if (section) section.scrollIntoView({ behavior: 'instant' });
      const cards = Array.from(document.querySelectorAll('.arrivals-card')).slice(0, 5);
      return {
        section: r(section),
        group: r(document.querySelector('.arrivals-section__group')),
        track: r(document.querySelector('.arrivals-section__swiper-track')),
        title: r(document.querySelector('.arrivals-section__title')),
        button: r(document.querySelector('.arrivals-section__button')),
        lang: r(document.querySelector('.arrivals-section__lang')),
        text: r(document.querySelector('.arrivals-section__text')),
        scroll: r(document.querySelector('.arrivals-section__scroll')),
        cards: cards.map(c => ({
          title: c.querySelector('.arrivals-card__title')?.textContent.trim(),
          rect: r(c)
        }))
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
  chrome.kill();
}
inspectArrivals().catch(console.error);
