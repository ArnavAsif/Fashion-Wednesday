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
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <video id="v" src="file:///C:/Users/ifas0/Downloads/Recording%202026-10-17%20112347.mp4" style="width:100%; height:auto;" muted playsinline></video>
      </body>
    </html>
  `;
  fs.writeFileSync('scratch/view_rec.html', htmlContent);

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9277',
    '--allow-file-access-from-files',
    '--window-size=500,1000',
    'file:///C:/projects-react/serotoninn/scratch/view_rec.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9277/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await send(ws, 1, 'Runtime.evaluate', {
    expression: `
      new Promise((resolve) => {
        const v = document.getElementById('v');
        v.onloadedmetadata = () => resolve({ duration: v.duration, w: v.videoWidth, h: v.videoHeight });
        if (v.readyState >= 1) resolve({ duration: v.duration, w: v.videoWidth, h: v.videoHeight });
      })
    `,
    awaitPromise: true,
    returnByValue: true
  }).then(r => console.log('Video info:', r.result.value));

  const times = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
  let id = 10;
  for (const t of times) {
    await send(ws, ++id, 'Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const v = document.getElementById('v');
          v.currentTime = ${t};
          v.onseeked = () => resolve(true);
        })
      `,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 300));
    const snap = await send(ws, ++id, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/rec_frame_${t}.png`, Buffer.from(snap.data, 'base64'));
    console.log(`Saved rec_frame_${t}.png`);
  }

  ws.close();
  chrome.kill();
}

run().catch(console.error);
