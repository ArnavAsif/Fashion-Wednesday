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
    '--remote-debugging-port=9289',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9289/json', r => {
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

  // Scroll to footer with lenis
  await send(ws, 2, 'Runtime.evaluate', {
    expression: `
      const f = document.getElementById('footer');
      if (window.__lenis) {
        window.__lenis.scrollTo(f, { immediate: true });
      } else {
        f.scrollIntoView();
      }
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  let snap = await send(ws, 3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/current_mobile_footer_top.png', Buffer.from(snap.data, 'base64'));

  // Scroll to bottom
  await send(ws, 4, 'Runtime.evaluate', {
    expression: `
      if (window.__lenis) {
        window.__lenis.scrollTo(document.body.scrollHeight, { immediate: true });
      } else {
        window.scrollTo(0, document.body.scrollHeight);
      }
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  snap = await send(ws, 5, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/current_mobile_footer_bottom.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Saved current_mobile_footer_top.png and current_mobile_footer_bottom.png');
}

run().catch(console.error);
