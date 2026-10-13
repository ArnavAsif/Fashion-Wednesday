const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9294',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 3500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9294/json', r => {
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

  // Hover over MENU +
  const menuBox = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.site-header .marker-btn-root'));
      const menu = btns.find(b => b.textContent.includes('MENU'));
      if (!menu) return null;
      const r = menu.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`,
    returnByValue: true
  });
  console.log('menuBox:', menuBox.result.value);
  if (menuBox.result.value) {
    const { x, y } = menuBox.result.value;
    await send(2, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await new Promise(r => setTimeout(r, 600));
    let snap = await send(3, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/live_header_hover_menu.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved scratch/live_header_hover_menu.png');
  }

  // Hover over BAG.0
  const bagBox = await send(4, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.site-header .marker-btn-root'));
      const bag = btns.find(b => b.textContent.includes('BAG'));
      if (!bag) return null;
      const r = bag.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`,
    returnByValue: true
  });
  console.log('bagBox:', bagBox.result.value);
  if (bagBox.result.value) {
    const { x, y } = bagBox.result.value;
    await send(5, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await new Promise(r => setTimeout(r, 600));
    let snap = await send(6, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/live_header_hover_bag.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved scratch/live_header_hover_bag.png');
  }

  ws.close();
  chrome.kill();
}
test().catch(e => console.error(e));
