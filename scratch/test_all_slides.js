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
    '--remote-debugging-port=9264',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9264/json', r => {
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
  await new Promise(r => setTimeout(r, 500));

  // Trigger arrivals:next
  await send(ws, 2, 'Runtime.evaluate', {
    expression: `window.dispatchEvent(new CustomEvent('arrivals:next'));`
  });
  await new Promise(r => setTimeout(r, 1200));

  const snap1 = await send(ws, 3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_slide1_velvet_witch.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved live_slide1_velvet_witch.png');

  // Trigger arrivals:next again to slide 2 (Velvet Bra Top)
  await send(ws, 4, 'Runtime.evaluate', {
    expression: `window.dispatchEvent(new CustomEvent('arrivals:next'));`
  });
  await new Promise(r => setTimeout(r, 1200));

  const snap2 = await send(ws, 5, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_slide2_velvet_bra.png', Buffer.from(snap2.data, 'base64'));
  console.log('Saved live_slide2_velvet_bra.png');

  // Trigger arrivals:next again to slide 3 (Mesh Dress)
  await send(ws, 6, 'Runtime.evaluate', {
    expression: `window.dispatchEvent(new CustomEvent('arrivals:next'));`
  });
  await new Promise(r => setTimeout(r, 1200));

  const snap3 = await send(ws, 7, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_slide3_mesh_dress.png', Buffer.from(snap3.data, 'base64'));
  console.log('Saved live_slide3_mesh_dress.png');

  // Trigger arrivals:next again to slide 4 (Sparkling Mini Dress)
  await send(ws, 8, 'Runtime.evaluate', {
    expression: `window.dispatchEvent(new CustomEvent('arrivals:next'));`
  });
  await new Promise(r => setTimeout(r, 1200));

  const snap4 = await send(ws, 9, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_slide4_sparkling_mini.png', Buffer.from(snap4.data, 'base64'));
  console.log('Saved live_slide4_sparkling_mini.png');

  ws.close();
  chrome.kill();
}
run().catch(console.error);
