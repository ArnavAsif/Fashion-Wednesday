const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function verify() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9455',
    '--window-size=1600,1000',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9455/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1000));

  function send(id, method, params = {}) {
    return new Promise(res => {
      const h = msg => {
        const data = JSON.parse(msg.data);
        if (data.id === id) { ws.removeEventListener('message', h); res(data.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // 1. Initial full viewport
  const snap1 = await send(1, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/final_prod_page.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved scratch/final_prod_page.png');

  // 2. Hover over [ M ]
  const coords = await send(2, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      const btn = btns.find(b => b.textContent.includes('M'));
      const r = btn.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()`,
    returnByValue: true
  });
  await send(3, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: Math.round(coords.result.value.x),
    y: Math.round(coords.result.value.y),
  });
  await new Promise(r => setTimeout(r, 400));
  const snap2 = await send(4, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/final_prod_hover_m.png', Buffer.from(snap2.data, 'base64'));
  console.log('Saved scratch/final_prod_hover_m.png');

  chrome.kill();
  process.exit(0);
}
verify().catch(e => { console.error(e); process.exit(1); });
