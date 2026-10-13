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

async function captureDump() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9260',
    '--window-size=1440,900',
    'file:///C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9260/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1500));

  await send(ws, 1, 'Runtime.evaluate', {
    expression: `(() => {
      const m = document.querySelector('.motion-section');
      if (m) m.scrollIntoView({ behavior: 'instant' });
    })()`
  });

  await new Promise(r => setTimeout(r, 500));

  const snap = await send(ws, 2, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/dump_motion_view.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved dump_motion_view.png');

  ws.close();
  chrome.kill();
}
captureDump().catch(console.error);
