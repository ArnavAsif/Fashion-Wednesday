const http = require('http');
const { spawn } = require('child_process');

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

async function testDiscount() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9231/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

      const res = await send(ws, 1, 'Runtime.evaluate', {
    expression: `(() => {
      const d = document.querySelector('.footer__discount');
      return {
        innerHTML: d ? d.innerHTML : null
      };
    })()`,
    returnByValue: true
  });
  console.log(res.result.value);

  await new Promise(r => setTimeout(r, 2000));

  const dRect = res.result.value.rect;
  if (dRect) {
    const snap = await send(ws, 2, 'Page.captureScreenshot', {
      clip: { x: dRect.x, y: dRect.y, width: dRect.width, height: dRect.height, scale: 1 }
    });
    const fs = require('fs');
    fs.writeFileSync('scratch/discount_crop.png', Buffer.from(snap.data, 'base64'));
    console.log('Saved discount_crop.png');
  }

  ws.close();
  chrome.kill();
}
testDiscount().catch(console.error);
