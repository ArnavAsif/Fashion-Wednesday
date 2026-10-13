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

async function captureCategoryDetailed() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9281',
    '--window-size=1920,1080',
    '--allow-file-access-from-files',
    'file:///C:/projects-react/serotoninn/scratch/player_vid2_144325.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9281/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const times = [0.5, 1.0, 1.8, 2.2, 3.0, 3.5, 4.2, 5.0, 5.8, 6.5, 7.0, 7.3, 7.8, 8.5, 9.2, 9.8];
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
    fs.writeFileSync(`scratch/cat_step_${t}.png`, Buffer.from(snap.data, 'base64'));
    console.log(`Captured cat_step_${t}.png`);
  }

  ws.close();
  chrome.kill();
}

captureCategoryDetailed().catch(console.error);
