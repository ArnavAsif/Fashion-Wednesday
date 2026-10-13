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
    '--remote-debugging-port=9262',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9262/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1000));

  // Scroll to arrivals section perfectly centered
  await send(ws, 1, 'Runtime.evaluate', {
    expression: `
      const el = document.getElementById('arrivals');
      if (el) {
        const top = el.offsetTop + 100;
        window.scrollTo({ top, behavior: 'instant' });
      }
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 1: Desktop Initial (Product 0: Sunna Dress)
  const snap1 = await send(ws, 2, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_arrivals_sunna.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved live_arrivals_sunna.png');

  // Hover over the center card's info area to trigger size pills
  const centerRectEval = await send(ws, 3, 'Runtime.evaluate', {
    expression: `
      const centerCard = document.querySelector('.arrivals-section__group-swiper.two li.active .arrivals-card');
      if (centerCard) {
        const r = centerCard.getBoundingClientRect();
        ({ x: r.left + r.width / 2, y: r.bottom - 15 });
      } else null;
    `,
    returnByValue: true
  });
  const hoverPos = centerRectEval.result.value;

  if (hoverPos) {
    console.log('Hovering center card at:', hoverPos);
    await send(ws, 4, 'Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: hoverPos.x,
      y: hoverPos.y
    });
    await new Promise(r => setTimeout(r, 600));

    // Screenshot 2: Center Card Hovered (with size selectors)
    const snap2 = await send(ws, 5, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/live_arrivals_hovered.png', Buffer.from(snap2.data, 'base64'));
    console.log('Saved live_arrivals_hovered.png');
  }

  // Navigate to slide 1 (Velvet Witch Corset)
  await send(ws, 6, 'Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 3: Slide 1 (Velvet Witch Corset)
  const snap3 = await send(ws, 7, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_arrivals_velvet_corset.png', Buffer.from(snap3.data, 'base64'));
  console.log('Saved live_arrivals_velvet_corset.png');

  // Navigate to slide 3 (Mesh Dress)
  await send(ws, 8, 'Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    `
  });
  await new Promise(r => setTimeout(r, 600));
  await send(ws, 9, 'Runtime.evaluate', {
    expression: `
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 4: Slide 3 (Mesh Dress)
  const snap4 = await send(ws, 10, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_arrivals_mesh_dress.png', Buffer.from(snap4.data, 'base64'));
  console.log('Saved live_arrivals_mesh_dress.png');

  ws.close();
  chrome.kill();
}
run().catch(console.error);
