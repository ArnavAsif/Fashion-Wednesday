const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9295',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9295/json', r => {
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

  await send(2, 'Runtime.evaluate', {
    expression: `window.scrollTo(0, ${fTop + 200})`
  });
  await new Promise(r => setTimeout(r, 800));

  const info = await send(3, 'Runtime.evaluate', {
    expression: `
      (() => {
        const logo = document.querySelector('.footer__logo');
        const img = document.querySelector('.footer__logo img');
        const fImg = document.querySelector('.footer__img');
        const container = document.querySelector('.footer .container');
        const footer = document.querySelector('.footer');
        return {
          logoMix: window.getComputedStyle(logo).mixBlendMode,
          imgMix: img ? window.getComputedStyle(img).mixBlendMode : null,
          logoWidth: logo.offsetWidth,
          imgWidth: img ? img.offsetWidth : null,
          containerZ: window.getComputedStyle(container).zIndex,
          containerPosition: window.getComputedStyle(container).position,
          containerIsolation: window.getComputedStyle(container).isolation,
          footerIsolation: window.getComputedStyle(footer).isolation,
          fImgZ: window.getComputedStyle(fImg).zIndex,
          fImgPos: window.getComputedStyle(fImg).position
        };
      })()
    `,
    returnByValue: true
  }).then(r => r.result.value);

  console.log('Computed styles:', info);

  ws.close();
  chrome.kill();
}
test();
