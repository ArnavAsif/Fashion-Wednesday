const http = require('http');

async function debug() {
  const json = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9223/json', (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
  });

  const page = json.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let reqId = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = reqId++;
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

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.arrivals-card');
      const track = document.querySelector('.arrivals-section__swiper-track');
      const group = document.querySelector('.arrivals-section__group');
      return {
        cardCount: cards.length,
        trackWidth: track ? track.offsetWidth : 0,
        trackScrollWidth: track ? track.scrollWidth : 0,
        groupWidth: group ? group.offsetWidth : 0,
        cards: Array.from(cards).slice(0, 4).map(c => {
          const r = c.getBoundingClientRect();
          return { title: c.querySelector('h3')?.innerText, x: r.x, y: r.y, w: r.width, h: r.height };
        })
      };
    })()`,
    returnByValue: true
  });

  console.log('Layout info:', JSON.stringify(res.value, null, 2));
  ws.close();
}

debug().catch(console.error);
