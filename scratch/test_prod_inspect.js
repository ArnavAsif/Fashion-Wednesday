const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function inspect() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9444',
    '--window-size=1600,1000',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9444/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1000));

  function send(id, method, params = {}) {
    return new Promise((resolve) => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const evalRes = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      const img = document.querySelector('.product-image-col img');
      const col = document.querySelector('.product-image-col');
      const main = document.querySelector('main');
      const header = document.querySelector('header');
      const brackets = Array.from(document.querySelectorAll('.bracket')).map(b => ({
        text: b.textContent,
        display: window.getComputedStyle(b).display,
        whiteSpace: window.getComputedStyle(b).whiteSpace,
        parentDisplay: window.getComputedStyle(b.parentElement).display,
        parentFlexDirection: window.getComputedStyle(b.parentElement).flexDirection,
        rect: b.getBoundingClientRect()
      }));
      return JSON.stringify({
        imgSrc: img ? img.src : null,
        imgNaturalW: img ? img.naturalWidth : null,
        imgNaturalH: img ? img.naturalHeight : null,
        imgVisible: img ? window.getComputedStyle(img).display : null,
        imgRect: img ? img.getBoundingClientRect() : null,
        colRect: col ? col.getBoundingClientRect() : null,
        brackets: brackets.slice(0, 4)
      }, null, 2);
    })()`,
    returnByValue: true
  });

  console.log('DOM Info:', evalRes.result ? evalRes.result.value : evalRes);

  const snap = await send(2, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/inspect_snap.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/inspect_snap.png');

  chrome.kill();
  process.exit(0);
}

inspect().catch(e => { console.error(e); process.exit(1); });
