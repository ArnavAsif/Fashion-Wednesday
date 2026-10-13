const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

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
    '--remote-debugging-port=9269',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9269/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await send(ws, 1, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await new Promise(r => setTimeout(r, 1000));

  await send(ws, 2, 'Runtime.evaluate', {
    expression: `
      const el = document.getElementById('arrivals');
      if (el) window.scrollTo({ top: el.offsetTop, behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const snap = await send(ws, 3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_arrivals_mobile_fixed.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved live_arrivals_mobile_fixed.png');

  ws.close();
  chrome.kill();
}
run().catch(console.error);
