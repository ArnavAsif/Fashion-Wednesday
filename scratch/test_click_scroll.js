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
    '--remote-debugging-port=9268',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9268/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await send(ws, 1, 'Log.enable');
  await send(ws, 2, 'Runtime.enable');
  ws.addEventListener('message', m => {
    const d = JSON.parse(m.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      console.log('BROWSER CONSOLE:', d.params.args.map(a => a.value).join(' '));
    }
  });

  await new Promise(r => setTimeout(r, 1500));

  // Click on the scrollbar around 40% (which should pick index 2: Velvet Bra Top)
  const clickRes = await send(ws, 3, 'Runtime.evaluate', {
    expression: `
      const scrollBar = document.querySelector('.arrivals-section__scroll');
      if (scrollBar) {
        const r = scrollBar.getBoundingClientRect();
        scrollBar.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          clientX: r.left + r.width * 0.4,
          clientY: r.top + r.height / 2
        }));
        'clicked'
      } else 'no scrollbar'
    `,
    returnByValue: true
  });
  console.log('Scrollbar click:', clickRes.result.value);

  await new Promise(r => setTimeout(r, 1000));

  const check = await send(ws, 4, 'Runtime.evaluate', {
    expression: `
      const activeLi = document.querySelector('.arrivals-section__group-swiper.one > li.active');
      activeLi ? activeLi.querySelector('.arrivals-card__title').textContent : 'NONE'
    `,
    returnByValue: true
  });
  console.log('Active product title after scrollbar click:', check.result.value);

  ws.close();
  chrome.kill();
}
run().catch(console.error);
