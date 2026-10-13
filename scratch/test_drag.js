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
    '--remote-debugging-port=9263',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9263/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1000));

  // Scroll to arrivals
  await send(ws, 1, 'Runtime.evaluate', {
    expression: `
      const el = document.getElementById('arrivals');
      if (el) window.scrollTo({ top: el.offsetTop + 100, behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 600));

  // Drag on the arrivals group to move to next item
  const dragRes = await send(ws, 2, 'Runtime.evaluate', {
    expression: `
      const group = document.querySelector('.arrivals-section__group');
      const r = group.getBoundingClientRect();
      ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    `,
    returnByValue: true
  });
  const pt = dragRes.result.value;

  console.log('Dragging from:', pt);
  await send(ws, 3, 'Input.dispatchMouseEvent', {
    type: 'mousePressed',
    button: 'left',
    x: pt.x,
    y: pt.y,
    clickCount: 1
  });
  await new Promise(r => setTimeout(r, 50));
  // Drag left by 100px
  await send(ws, 4, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    button: 'left',
    x: pt.x - 120,
    y: pt.y
  });
  await new Promise(r => setTimeout(r, 50));
  await send(ws, 5, 'Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    button: 'left',
    x: pt.x - 120,
    y: pt.y
  });

  // Wait for the transition
  await new Promise(r => setTimeout(r, 1200));

  const snap1 = await send(ws, 6, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_after_drag_1.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved live_after_drag_1.png');

  // Drag again to slide 2
  await send(ws, 7, 'Input.dispatchMouseEvent', {
    type: 'mousePressed',
    button: 'left',
    x: pt.x,
    y: pt.y,
    clickCount: 1
  });
  await new Promise(r => setTimeout(r, 50));
  await send(ws, 8, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    button: 'left',
    x: pt.x - 120,
    y: pt.y
  });
  await new Promise(r => setTimeout(r, 50));
  await send(ws, 9, 'Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    button: 'left',
    x: pt.x - 120,
    y: pt.y
  });
  await new Promise(r => setTimeout(r, 1200));

  const snap2 = await send(ws, 10, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_after_drag_2.png', Buffer.from(snap2.data, 'base64'));
  console.log('Saved live_after_drag_2.png');

  ws.close();
  chrome.kill();
}
run().catch(console.error);
