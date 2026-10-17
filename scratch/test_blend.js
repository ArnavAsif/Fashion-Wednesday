const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9296',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9296/json', r => {
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

  const fTop = await send(1, 'Runtime.evaluate', {
    expression: 'document.getElementById("footer").offsetTop',
    returnByValue: true
  }).then(r => r.result.value);

  console.log('footer offsetTop:', fTop);

  await send(2, 'Runtime.evaluate', {
    expression: `
      if (window.__lenis) window.__lenis.scrollTo(${fTop + 200}, { immediate: true });
      else window.scrollTo(0, ${fTop + 200});
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Let's modify the styles via DOM
  await send(3, 'Runtime.evaluate', {
    expression: `
      (() => {
        const logo = document.querySelector('.footer__logo');
        const container = document.querySelector('.footer .container');
        // Test max-width: 420px, mix-blend-mode: difference
        logo.style.maxWidth = '420px';
        logo.style.width = '100%';
        logo.style.margin = '0 auto 6.1rem auto';
        logo.style.mixBlendMode = 'difference';
        logo.style.background = 'transparent';

        const logoImg = document.querySelector('.footer__logo img');
        if (logoImg) {
          logoImg.style.maxWidth = '420px';
          logoImg.style.width = '100%';
          logoImg.style.background = 'transparent';
          logoImg.style.mixBlendMode = 'difference';
        }

        container.style.zIndex = 'auto';
        container.style.position = 'static';
      })()
    `
  });

  await new Promise(r => setTimeout(r, 500));

  const snap = await send(4, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/test_blend_desk.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
}
test();
