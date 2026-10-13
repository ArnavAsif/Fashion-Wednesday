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
    '--remote-debugging-port=9259',
    '--window-size=1920,1080',
    '--allow-file-access-from-files',
    'file:///C:/projects-react/serotoninn/scratch/player.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9259/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const times = [0.7, 0.85, 1.0, 1.15, 1.3, 1.4];

  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    await send(ws, 10 + i, 'Runtime.evaluate', {
      expression: `new Promise(res => {
        const v = document.getElementById('v');
        v.currentTime = ${t};
        v.onseeked = () => res(true);
      })`,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 200));
    const snap = await send(ws, 100 + i, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/rec_trans_${t}.png`, Buffer.from(snap.data, 'base64'));
    console.log(`Captured rec_trans_${t}.png`);
  }

  ws.close();
  chrome.kill();
}
run().catch(console.error);
