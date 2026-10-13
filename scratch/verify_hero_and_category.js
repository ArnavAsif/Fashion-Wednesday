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

async function verify() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9288',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 3000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9288/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // 1. Initial Hero Section snapshot
  await new Promise(r => setTimeout(r, 1000));
  let snap = await send(ws, 1, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_hero_initial.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/live_hero_initial.png');

  // 2. Wait 5.5 seconds for Hero slide transition and capture
  console.log('Waiting for hero transition...');
  await new Promise(r => setTimeout(r, 5500));
  snap = await send(ws, 2, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_hero_transitioned.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/live_hero_transitioned.png');

  // 3. Scroll to Best / Category section (05. CATEGORIES)
  await send(ws, 3, 'Runtime.evaluate', {
    expression: `document.getElementById('best').scrollIntoView({ behavior: 'instant', block: 'center' })`
  });
  await new Promise(r => setTimeout(r, 1000));
  snap = await send(ws, 4, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_cat_initial.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/live_cat_initial.png');

  // 4. Hover over Left Card (Dresses)
  const leftBox = await send(ws, 5, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.best-section__top');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`,
    returnByValue: true
  });
  if (leftBox.result.value) {
    const { x, y } = leftBox.result.value;
    await send(ws, 6, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await new Promise(r => setTimeout(r, 600));
    snap = await send(ws, 7, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/live_cat_hover_left.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved scratch/live_cat_hover_left.png');
  }

  // 5. Hover over Right Card (Corsets)
  const rightBox = await send(ws, 8, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.best-section__bottom');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`,
    returnByValue: true
  });
  if (rightBox.result.value) {
    const { x, y } = rightBox.result.value;
    await send(ws, 9, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await new Promise(r => setTimeout(r, 600));
    snap = await send(ws, 10, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/live_cat_hover_right.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved scratch/live_cat_hover_right.png');
  }

  ws.close();
  chrome.kill();
  console.log('All verification snapshots complete!');
}

verify().catch(console.error);
