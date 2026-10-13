const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9293',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 3500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9293/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  function send(id, method, params = {}) {
    return new Promise((resolve, reject) => {
      const h = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === id) {
          ws.removeEventListener('message', h);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Scroll to Arrivals
  await send(1, 'Runtime.evaluate', {
    expression: `window.scrollTo({ top: window.innerHeight, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 1000));
  let snap = await send(2, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_scroll_arrivals.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/live_scroll_arrivals.png');

  // Scroll back up slightly to see header reappear
  await send(3, 'Runtime.evaluate', {
    expression: `window.scrollBy({ top: -100, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 600));
  snap = await send(4, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_scroll_header_reappear.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/live_scroll_header_reappear.png');

  ws.close();
  chrome.kill();
}
test().catch(e => console.error(e));
