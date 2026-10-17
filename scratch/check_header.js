const http = require('http');
const { spawn } = require('child_process');

async function check() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9334',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9334/json', r => {
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
  await new Promise(r => setTimeout(r, 600));

  const info = await send(2, 'Runtime.evaluate', {
    expression: `
      (() => {
        const header = document.querySelector('header');
        const overlay = document.querySelector('.categories-menu-overlay');
        return {
          headerDisplay: window.getComputedStyle(header).display,
          headerZ: window.getComputedStyle(header).zIndex,
          headerColor: window.getComputedStyle(header).color,
          headerMix: window.getComputedStyle(header).mixBlendMode,
          overlayZ: window.getComputedStyle(overlay).zIndex,
          overlayBg: window.getComputedStyle(overlay).backgroundColor,
          headerRect: header.getBoundingClientRect()
        };
      })()
    `,
    returnByValue: true
  }).then(r => r.result.value);

  console.log(info);
  ws.close();
  chrome.kill();
}
check();
