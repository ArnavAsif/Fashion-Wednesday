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

async function extractVideo() {
  const videoPath = 'file:///C:/Users/ifas0/Downloads/Recording%202026-10-13%20154839.mp4';
  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#000;">
  <video id="v" src="${videoPath}" controls style="width:100vw;height:100vh;object-fit:contain;"></video>
</body>
</html>
`;
  fs.writeFileSync('scratch/player_154839.html', htmlContent);

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9291',
    '--window-size=1920,1080',
    '--allow-file-access-from-files',
    'file:///C:/projects-react/serotoninn/scratch/player_154839.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9291/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await send(ws, 1, 'Runtime.evaluate', {
    expression: `new Promise(res => {
      const v = document.getElementById('v');
      v.onloadedmetadata = () => res(v.duration);
      if (v.duration) res(v.duration);
    })`,
    awaitPromise: true
  });

  const durationEval = await send(ws, 2, 'Runtime.evaluate', {
    expression: 'document.getElementById("v").duration'
  });
  const duration = durationEval.result.value || 5;
  console.log('Video duration:', duration);

  const count = 6;
  const times = [];
  for (let i = 0; i < count; i++) {
    const t = Math.min(duration - 0.1, Number((0.2 + (duration - 0.4) * (i / (count - 1))).toFixed(2)));
    if (!times.includes(t)) times.push(t);
  }

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
    await new Promise(r => setTimeout(r, 300));
    const snap = await send(ws, 100 + i, 'Page.captureScreenshot', { format: 'png' });
    const outFile = `scratch/rec_154839_${t}.png`;
    fs.writeFileSync(outFile, Buffer.from(snap.data, 'base64'));
    console.log(`Captured ${outFile}`);
  }

  ws.close();
  chrome.kill();
  console.log('Done extraction!');
}

extractVideo().catch(console.error);
