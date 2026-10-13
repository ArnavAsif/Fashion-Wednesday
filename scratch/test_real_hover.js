const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

function send(ws, id, method, params = {}) {
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

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9320',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9320/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1500));

  // Center discount button into view
  await send(ws, 1, 'Runtime.evaluate', {
    expression: 'document.querySelector(".footer__discount").scrollIntoView({ behavior: "instant", block: "center" });'
  });
  await new Promise(r => setTimeout(r, 1000));

  // Get button coordinates
  const btnCoords = await send(ws, 2, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.footer__discount-btn');
      const b = btn.getBoundingClientRect();
      return {
        x: Math.round(b.x + b.width / 2),
        y: Math.round(b.y + b.height / 2),
        width: b.width,
        height: b.height
      };
    })()`,
    returnByValue: true
  });
  console.log('Button center in viewport:', btnCoords.result.value);

  // 1. Screenshot BEFORE hover (cursor at 0, 0)
  await send(ws, 3, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 0,
    y: 0
  });
  await new Promise(r => setTimeout(r, 500));

  let snap = await send(ws, 4, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/real_hover_before.png', Buffer.from(snap.data, 'base64'));

  // 2. Move mouse to button center!
  const { x, y } = btnCoords.result.value;
  await send(ws, 5, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x,
    y
  });
  await new Promise(r => setTimeout(r, 600));

  // Check revealed state in DOM
  const hoverCheck = await send(ws, 6, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.footer__discount-btn');
      const rev = document.querySelector('.footer__discount-reveal');
      const cs = window.getComputedStyle(rev);
      return {
        btnClass: btn.className,
        revMaxWidth: cs.maxWidth,
        revOpacity: cs.opacity,
        revTransform: cs.transform,
        revOffsetWidth: rev.offsetWidth,
        btnWidth: btn.offsetWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('DOM state when mouse moved over button:', hoverCheck.result.value);

  // Screenshot HOVERED
  snap = await send(ws, 7, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/real_hover_after.png', Buffer.from(snap.data, 'base64'));

  // 3. Move mouse away to 0, 0
  await send(ws, 8, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 0,
    y: 0
  });
  await new Promise(r => setTimeout(r, 600));

  snap = await send(ws, 9, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/real_hover_unhovered.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Finished real hover test!');
}

run().catch(console.error);
