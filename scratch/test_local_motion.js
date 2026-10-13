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

async function testMotion() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9258',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9258/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 2000));

  // Inspect motion section upon scroll to it
  const info = await send(ws, 1, 'Runtime.evaluate', {
    expression: `(() => {
      const m = document.getElementById('film') || document.querySelector('.motion-section');
      if (!m) return { error: 'not found' };
      m.scrollIntoView({ behavior: 'instant' });
      const mask = document.querySelector('.motion-section__bottom');
      return {
        maskStyle: mask ? mask.getAttribute('style') : null,
        computedMaskW: mask ? getComputedStyle(mask).getPropertyValue('--maskW') : null,
        maskWebkitMask: mask ? getComputedStyle(mask).webkitMask : null,
        pinRect: document.querySelector('.motion-section__pin') ? document.querySelector('.motion-section__pin').getBoundingClientRect() : null,
        textRect: document.querySelector('.motion-section__mid') ? document.querySelector('.motion-section__mid').getBoundingClientRect() : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Motion info:', JSON.stringify(info.result.value, null, 2));

  await new Promise(r => setTimeout(r, 500));

  const snap = await send(ws, 2, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/local_motion_start.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved local_motion_start.png');

  ws.close();
  chrome.kill();
}
testMotion().catch(console.error);
