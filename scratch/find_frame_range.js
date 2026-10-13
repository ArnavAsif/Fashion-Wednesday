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
    '--remote-debugging-port=9256',
    '--window-size=1440,900',
    'http://localhost:3000/test_lottie.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9256/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1000));

  for (const frame of [50, 55, 58, 60, 62, 70, 85, 95, 105, 115, 119]) {
    await send(ws, frame + 10, 'Runtime.evaluate', {
      expression: `window.anim.goToAndStop(${frame}, true);`
    });
    await new Promise(r => setTimeout(r, 150));
    const snap = await send(ws, frame + 100, 'Page.captureScreenshot', {
      clip: { x: 0, y: 0, width: 400, height: 250, scale: 1 }
    });
    fs.writeFileSync(`scratch/f_${frame}.png`, Buffer.from(snap.data, 'base64'));
    console.log(`Saved f_${frame}.png`);
  }

  ws.close();
  chrome.kill();
}
run().catch(console.error);
