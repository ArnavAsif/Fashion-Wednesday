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
    '--remote-debugging-port=9355',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9355/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to footer discount
  await send(ws, 1, 'Runtime.evaluate', {
    expression: 'document.querySelector(".footer__discount").scrollIntoView({ behavior: "instant", block: "center" });'
  });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Check initial state
  const btnCoords = await send(ws, 2, 'Runtime.evaluate', {
    expression: `(() => {
      const d = document.querySelector('.footer__discount');
      const b = d ? d.getBoundingClientRect() : null;
      return {
        hasDiscount: !!d,
        hasCanvas: !!(d && d.querySelector('canvas')),
        b: b ? { x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2), width: Math.round(b.width), height: Math.round(b.height) } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Discount initial:', btnCoords.result.value);

  // Position cursor away at 0, 0
  await send(ws, 3, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 0,
    y: 0
  });
  await new Promise(r => setTimeout(r, 500));

  let snap = await send(ws, 4, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/footer_lottie_initial.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved footer_lottie_initial.png');

  // 2. Hover over discount badge
  const { x, y } = btnCoords.result.value.b;
  console.log('Moving mouse to', x, y);
  await send(ws, 5, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x,
    y
  });
  await new Promise(r => setTimeout(r, 600));

  snap = await send(ws, 6, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/footer_lottie_hovered.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved footer_lottie_hovered.png');

  // 3. Move mouse away to 0, 0
  await send(ws, 7, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 0,
    y: 0
  });
  await new Promise(r => setTimeout(r, 600));

  snap = await send(ws, 8, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/footer_lottie_unhovered.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved footer_lottie_unhovered.png');

  ws.close();
  chrome.kill();
  console.log('Verification done!');
}
run().catch(console.error);
