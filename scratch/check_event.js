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
    '--remote-debugging-port=9266',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9266/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1000));

  const check1 = await send(ws, 1, 'Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new CustomEvent('arrivals:next'));
      'dispatched'
    `,
    returnByValue: true
  });
  console.log(check1);

  // Wait 1 second
  await new Promise(r => setTimeout(r, 1000));

  const check2 = await send(ws, 2, 'Runtime.evaluate', {
    expression: `
      const activeLi = document.querySelector('.arrivals-section__group-swiper.one > li.active');
      activeLi ? activeLi.querySelector('.arrivals-card__title').textContent : 'NONE'
    `,
    returnByValue: true
  });
  console.log('Active product title after arrivals:next:', check2.result.value);

  ws.close();
  chrome.kill();
}
run().catch(console.error);
