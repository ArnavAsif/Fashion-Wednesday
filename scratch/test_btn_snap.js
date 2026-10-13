const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9355',
    '--window-size=800,450',
    'http://localhost:3000/test_btn.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9355/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1000));

  function send(id, method, params = {}) {
    return new Promise((resolve, reject) => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Hover over #btn-size-m
  await send(1, 'Runtime.evaluate', {
    expression: 'document.getElementById("btn-size-m").dispatchEvent(new MouseEvent("mouseenter"));'
  });
  await new Promise(r => setTimeout(r, 400));

  let snap = await send(2, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_btn_hover_m.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_btn_hover_m.png');

  // Hover over #btn-details
  await send(3, 'Runtime.evaluate', {
    expression: 'document.getElementById("btn-details").dispatchEvent(new MouseEvent("mouseenter"));'
  });
  await new Promise(r => setTimeout(r, 400));

  snap = await send(4, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_btn_hover_details.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_btn_hover_details.png');

  chrome.kill();
  process.exit(0);
}
test().catch(e => { console.error(e); process.exit(1); });
