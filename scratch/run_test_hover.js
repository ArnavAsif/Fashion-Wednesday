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
    '--remote-debugging-port=9257',
    '--window-size=1440,900',
    'http://localhost:3000/test_hover.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9257/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1200));

  // Screenshot initial
  const snap1 = await send(ws, 1, 'Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 400, height: 250, scale: 1 }
  });
  fs.writeFileSync('scratch/hover_initial.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved hover_initial.png');

  // Trigger hover
  await send(ws, 2, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('container');
      el.dispatchEvent(new MouseEvent('mouseenter'));
    })()`
  });
  await new Promise(r => setTimeout(r, 700));

  // Screenshot hovered
  const snap2 = await send(ws, 3, 'Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 400, height: 250, scale: 1 }
  });
  fs.writeFileSync('scratch/hover_hovered.png', Buffer.from(snap2.data, 'base64'));
  console.log('Saved hover_hovered.png');

  // Trigger mouseleave
  await send(ws, 4, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('container');
      el.dispatchEvent(new MouseEvent('mouseleave'));
    })()`
  });
  await new Promise(r => setTimeout(r, 700));

  // Screenshot unhovered
  const snap3 = await send(ws, 5, 'Page.captureScreenshot', {
    clip: { x: 0, y: 0, width: 400, height: 250, scale: 1 }
  });
  fs.writeFileSync('scratch/hover_unhovered.png', Buffer.from(snap3.data, 'base64'));
  console.log('Saved hover_unhovered.png');

  ws.close();
  chrome.kill();
}
run().catch(console.error);
