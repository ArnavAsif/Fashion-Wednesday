const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9333',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 3000));
  const json = await new Promise((res, rej) => http.get('http://127.0.0.1:9333/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));

  const page = json.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let idCounter = 1;
  function send(method, params = {}) {
    const id = idCounter++;
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
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('button, a, span'));
        const catBtn = els.find(b => b.textContent && b.textContent.includes('CATEGORIES'));
        if (catBtn) catBtn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  // Hover on BODYS
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.menu--categories .menu__list button'));
        const bodysBtn = btns.find(b => b.textContent && b.textContent.includes('BODYS'));
        if (bodysBtn) {
          bodysBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          bodysBtn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/categories_fullscreen_test.png', Buffer.from(shot.data, 'base64'));
  console.log('Categories screenshot captured!');

  edge.kill();
  process.exit(0);
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
