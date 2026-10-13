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

// Create temporary HTML that plays the video
const videoPath = 'file:///C:/Users/ifas0/Downloads/Recording%202026-10-13%20110803.mp4';
const htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#000;">
  <video id="v" src="${videoPath}" controls style="width:100vw;height:100vh;object-fit:contain;"></video>
</body>
</html>
`;
fs.writeFileSync('scratch/player.html', htmlContent);

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9258',
    '--window-size=1920,1080',
    '--allow-file-access-from-files',
    'file:///C:/projects-react/serotoninn/scratch/player.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9258/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // Wait for video loaded
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
  const duration = durationEval.result.value;
  console.log('Video duration:', duration);

  const times = [0.5, 1.5, 3, 5, 7, 9, 11, 13, 15].filter(t => t < duration);

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
    const snap = await send(ws, 100 + i, 'Page.captureScreenshot', {
      format: 'png'
    });
    fs.writeFileSync(`scratch/rec_time_${t}.png`, Buffer.from(snap.data, 'base64'));
    console.log(`Captured rec_time_${t}.png`);
  }

  ws.close();
  chrome.kill();
}
run().catch(console.error);
