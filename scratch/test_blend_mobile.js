const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9297',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9297/json', r => {
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
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  const fTop = await send(2, 'Runtime.evaluate', {
    expression: 'document.getElementById("footer").offsetTop',
    returnByValue: true
  }).then(r => r.result.value);

  console.log('mobile footer offsetTop:', fTop);

  await send(3, 'Runtime.evaluate', {
    expression: `
      if (window.__lenis) window.__lenis.scrollTo(${fTop + 400}, { immediate: true });
      else window.scrollTo(0, ${fTop + 400});
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Let's modify the styles via DOM
  await send(4, 'Runtime.evaluate', {
    expression: `
      (() => {
        const logo = document.querySelector('.footer__logo');
        const container = document.querySelector('.footer .container');
        // Replace image src with /images/bonez-logo-white.png
        const logoImg = document.querySelector('.footer__logo img');
        if (logoImg) {
          logoImg.src = '/images/bonez-logo-white.png';
          logoImg.alt = 'BONEZ';
          logoImg.style.maxWidth = '280px';
          logoImg.style.width = '100%';
          logoImg.style.background = 'transparent';
          logoImg.style.mixBlendMode = 'difference';
          logoImg.style.display = 'block';
          logoImg.style.margin = '0 auto';
        }

        const source = document.querySelector('.footer__logo source');
        if (source) source.remove();

        logo.style.maxWidth = '280px';
        logo.style.width = '100%';
        logo.style.margin = '0 auto 4rem auto';
        logo.style.mixBlendMode = 'difference';
        logo.style.background = 'transparent';
        logo.style.display = 'flex';
        logo.style.justifyContent = 'center';

        container.style.zIndex = 'auto';
        container.style.position = 'static';

        const mobOnly = document.querySelector('.footer-mob-only');
        if (mobOnly) mobOnly.textContent = '©2026_BONEZ';
      })()
    `
  });

  await new Promise(r => setTimeout(r, 600));

  const snap = await send(5, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/test_blend_mobile.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
}
test();
