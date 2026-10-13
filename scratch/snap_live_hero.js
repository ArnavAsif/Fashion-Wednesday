const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9296',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 3500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9296/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  function send(id, method, params = {}) {
    return new Promise((resolve) => {
      const h = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === id) { ws.removeEventListener('message', h); resolve(data.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => setTimeout(r, 1000));
  let snap = await send(1, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_hero_now.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/live_hero_now.png');

  // Hover over [ SEE COLLECTION ]
  const btnBox = await send(2, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.hero-section__text');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`,
    returnByValue: true
  });
  if (btnBox.result.value) {
    const { x, y } = btnBox.result.value;
    await send(3, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await new Promise(r => setTimeout(r, 600));
    snap = await send(4, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/live_hero_hover_btn.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved scratch/live_hero_hover_btn.png');
  }

  // Hover over top right BAG
  const bagBox = await send(5, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.site-header .marker-btn-wrap');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`,
    returnByValue: true
  });
  if (bagBox.result.value) {
    const { x, y } = bagBox.result.value;
    await send(6, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await new Promise(r => setTimeout(r, 600));
    snap = await send(7, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/live_hero_hover_nav.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved scratch/live_hero_hover_nav.png');
  }

  ws.close();
  chrome.kill();
}
test().catch(e => console.error(e));
