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
    '--remote-debugging-port=9299',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 3000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9299/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // 1. Initial Hero Section
  await new Promise(r => setTimeout(r, 2000));
  let snap = await send(ws, 1, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_hero_initial.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/snap_hero_initial.png');

  // 2. Wait 5.5s for Hero curtain roll transition
  console.log('Waiting for hero transition...');
  await new Promise(r => setTimeout(r, 5500));
  snap = await send(ws, 2, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_hero_rolled.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/snap_hero_rolled.png');

  // 3. Scroll to Best / Category section
  await send(ws, 3, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('best');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));
  snap = await send(ws, 4, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_category_initial.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/snap_category_initial.png');

  // 4. Hover over left card
  await send(ws, 5, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: 450, y: 540 });
  await new Promise(r => setTimeout(r, 800));
  snap = await send(ws, 6, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_category_hover_left.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/snap_category_hover_left.png');

  // 5. Hover over right card
  await send(ws, 7, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1450, y: 540 });
  await new Promise(r => setTimeout(r, 800));
  snap = await send(ws, 8, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_category_hover_right.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/snap_category_hover_right.png');

  ws.close();
  chrome.kill();
  console.log('Done!');
}

run().catch(console.error);
