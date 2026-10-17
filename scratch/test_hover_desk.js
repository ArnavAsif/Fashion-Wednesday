const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testHover() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9335',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9335/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(id, method, params = {}) {
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

  // Click CATEGORIES
  await send(1, 'Runtime.evaluate', {
    expression: `
      const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
      const catEl = els.find(b => b.textContent && b.textContent.trim().startsWith('CATEGORIES'));
      if (catEl) catEl.click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Trigger mouseover on BODYS
  await send(2, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.categories-menu-list button'));
        const bodysBtn = btns.find(b => b.textContent && b.textContent.includes('BODYS'));
        if (bodysBtn) {
          bodysBtn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
          bodysBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          bodysBtn.focus();
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  let snap = await send(3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_cat_bodys_hovered.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_desk_cat_bodys_hovered.png');

  ws.close();
  chrome.kill();
}
testHover();
