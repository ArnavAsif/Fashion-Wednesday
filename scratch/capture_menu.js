const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless',
    '--remote-debugging-port=9334',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 3000));
  const json = await new Promise((res, rej) => http.get('http://127.0.0.1:9334/json', r => {
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

  // Click MENU
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('button, a, span'));
        const menuBtn = els.find(b => b.textContent && b.textContent.trim().startsWith('MENU'));
        if (menuBtn) menuBtn.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/menu_fullscreen_test.png', Buffer.from(shot.data, 'base64'));
  console.log('Menu screenshot captured!');

  edge.kill();
  process.exit(0);
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
