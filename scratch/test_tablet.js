const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9301',
    '--window-size=768,1024',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9301/json', r => {
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

  await send(1, 'Emulation.setDeviceMetricsOverride', {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    mobile: false
  });

  const fTop = await send(2, 'Runtime.evaluate', {
    expression: 'document.getElementById("footer").offsetTop',
    returnByValue: true
  }).then(r => r.result.value);

  await send(3, 'Runtime.evaluate', {
    expression: `
      if (window.__lenis) window.__lenis.scrollTo(${fTop + 200}, { immediate: true });
      else window.scrollTo(0, ${fTop + 200});
    `
  });
  await new Promise(r => setTimeout(r, 800));

  await send(4, 'Runtime.evaluate', {
    expression: `
      (() => {
        const logo = document.querySelector('.footer__logo');
        const container = document.querySelector('.footer .container');
        container.style.position = 'relative';
        container.style.zIndex = 'auto';

        const logoImg = document.querySelector('.footer__logo img');
        if (logoImg) {
          logoImg.src = '/images/bonez-logo-white.png';
          logoImg.alt = 'BONEZ';
          logoImg.style.maxWidth = '360px';
          logoImg.style.width = '100%';
          logoImg.style.background = 'transparent';
          logoImg.style.mixBlendMode = 'difference';
          logoImg.style.display = 'block';
          logoImg.style.margin = '0 auto';
        }

        const source = document.querySelector('.footer__logo source');
        if (source) source.remove();

        logo.style.maxWidth = '360px';
        logo.style.width = '100%';
        logo.style.margin = '0 auto 5rem auto';
        logo.style.mixBlendMode = 'difference';
        logo.style.background = 'transparent';
        logo.style.display = 'flex';
        logo.style.justifyContent = 'center';

        const mobOnly = document.querySelector('.footer-mob-only');
        if (mobOnly) mobOnly.textContent = '©2026_BONEZ';
      })()
    `
  });

  await new Promise(r => setTimeout(r, 500));

  const snap = await send(5, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_tablet_footer.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_tablet_footer.png');
  ws.close();
  chrome.kill();
}
run();
