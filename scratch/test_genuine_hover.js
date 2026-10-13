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

async function testFooterLottie() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9267',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9267/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 2000));

  await send(ws, 1, 'Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('footer').scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  const check = await send(ws, 2, 'Runtime.evaluate', {
    expression: `(() => {
      const d = document.querySelector('.footer__discount');
      const b = d ? d.getBoundingClientRect() : null;
      return {
        hasCanvas: !!(d && d.querySelector('canvas')),
        dRect: b ? { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) } : null,
        scrollX: window.scrollX,
        scrollY: window.scrollY
      };
    })()`,
    returnByValue: true
  });
  console.log('Discount info:', check.result.value);

  const rect = check.result.value.dRect;
  const sx = check.result.value.scrollX;
  const sy = check.result.value.scrollY;

  // Screenshot before hover using document coordinates
  const snapBefore = await send(ws, 3, 'Page.captureScreenshot', {
    clip: { x: rect.x + sx - 10, y: rect.y + sy - 10, width: rect.width + 20, height: rect.height + 20, scale: 1 }
  });
  fs.writeFileSync('scratch/genuine_before.png', Buffer.from(snapBefore.data, 'base64'));
  console.log('Saved genuine_before.png');

  // Move mouse to viewport coordinates of discount badge
  const vx = rect.x + rect.width / 2;
  const vy = rect.y + rect.height / 2;

  await send(ws, 4, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: vx,
    y: vy
  });

  await new Promise(r => setTimeout(r, 800));

  const snapHover = await send(ws, 5, 'Page.captureScreenshot', {
    clip: { x: rect.x + sx - 10, y: rect.y + sy - 10, width: rect.width + 20, height: rect.height + 20, scale: 1 }
  });
  fs.writeFileSync('scratch/genuine_hover.png', Buffer.from(snapHover.data, 'base64'));
  console.log('Saved genuine_hover.png');

  // Move mouse out
  await send(ws, 6, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 0,
    y: 0
  });

  await new Promise(r => setTimeout(r, 800));

  const snapAfter = await send(ws, 7, 'Page.captureScreenshot', {
    clip: { x: rect.x + sx - 10, y: rect.y + sy - 10, width: rect.width + 20, height: rect.height + 20, scale: 1 }
  });
  fs.writeFileSync('scratch/genuine_after.png', Buffer.from(snapAfter.data, 'base64'));
  console.log('Saved genuine_after.png');

  ws.close();
  chrome.kill();
}
testFooterLottie().catch(console.error);
