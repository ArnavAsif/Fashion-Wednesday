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
    '--remote-debugging-port=9260',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9260/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1500));

  // Scroll to arrivals section
  await send(ws, 1, 'Runtime.evaluate', {
    expression: `
      const el = document.getElementById('arrivals');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot 1: Desktop Initial (Product 0: Sunna Dress)
  const snap1 = await send(ws, 2, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_arrivals_initial.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved live_arrivals_initial.png');

  // Hover over the center card
  await send(ws, 3, 'Runtime.evaluate', {
    expression: `
      const centerCard = document.querySelector('.arrivals-section__group-swiper.two li.active .arrivals-card');
      if (centerCard) {
        const rect = centerCard.getBoundingClientRect();
        window.__hoverPos = { x: rect.left + rect.width / 2, y: rect.bottom - 20 };
      }
    `
  });

  const posEval = await send(ws, 4, 'Runtime.evaluate', {
    expression: 'window.__hoverPos'
  });
  const pos = posEval.result.value;

  if (pos) {
    await send(ws, 5, 'Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: pos.x,
      y: pos.y
    });
    await new Promise(r => setTimeout(r, 600));

    // Screenshot 2: Center Card Hovered (with size selectors)
    const snap2 = await send(ws, 6, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/live_arrivals_hovered.png', Buffer.from(snap2.data, 'base64'));
    console.log('Saved live_arrivals_hovered.png');
  }

  // Navigate to next slide (Product 1: Velvet Witch Corset)
  await send(ws, 7, 'Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 3: Next slide (Product 1)
  const snap3 = await send(ws, 8, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_arrivals_slide2.png', Buffer.from(snap3.data, 'base64'));
  console.log('Saved live_arrivals_slide2.png');

  // Test mobile viewport
  await send(ws, 9, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send(ws, 10, 'Runtime.evaluate', {
    expression: `
      const el = document.getElementById('arrivals');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 4: Mobile View
  const snap4 = await send(ws, 11, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_arrivals_mobile.png', Buffer.from(snap4.data, 'base64'));
  console.log('Saved live_arrivals_mobile.png');

  ws.close();
  chrome.kill();
}
run().catch(console.error);
