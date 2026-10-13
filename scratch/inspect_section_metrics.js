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
    '--remote-debugging-port=9261',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9261/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const evalRes = await send(ws, 1, 'Runtime.evaluate', {
    expression: `
      const arrivals = document.querySelector('.arrivals-section');
      const group = document.querySelector('.arrivals-section__group');
      const col1 = document.querySelector('.arrivals-section__group-swiper.one');
      const firstLi = col1 ? col1.querySelector('li') : null;
      const campaign = document.querySelector('.campaign-section');

      ({
        arrivals: arrivals ? {
          height: arrivals.offsetHeight,
          top: arrivals.offsetTop,
          rect: arrivals.getBoundingClientRect()
        } : null,
        group: group ? {
          height: group.offsetHeight,
          rect: group.getBoundingClientRect()
        } : null,
        col1: col1 ? {
          height: col1.offsetHeight,
          rect: col1.getBoundingClientRect()
        } : null,
        firstLi: firstLi ? {
          height: firstLi.offsetHeight,
          position: window.getComputedStyle(firstLi).position,
          rect: firstLi.getBoundingClientRect()
        } : null,
        campaign: campaign ? {
          top: campaign.offsetTop,
          rect: campaign.getBoundingClientRect()
        } : null
      })
    `,
    returnByValue: true
  });

  console.log(JSON.stringify(evalRes.result.value, null, 2));

  ws.close();
  chrome.kill();
}
run().catch(console.error);
