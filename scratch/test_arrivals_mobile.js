const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9294',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));

  const json = await new Promise((res, rej) => http.get('http://127.0.0.1:9294/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));

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
    mobile: true,
    hasTouch: true,
  });

  // Scroll to #arrivals
  const arrivalsTop = await send(2, 'Runtime.evaluate', {
    expression: 'document.getElementById("arrivals") ? document.getElementById("arrivals").offsetTop : 0',
    returnByValue: true
  }).then(r => r.result.value);

  console.log('Arrivals section top:', arrivalsTop);

  await send(3, 'Runtime.evaluate', {
    expression: `
      if (window.__lenis) window.__lenis.scrollTo(${arrivalsTop - 20}, { immediate: true });
      else window.scrollTo(0, ${arrivalsTop - 20});
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Take screenshot 1
  let snap = await send(4, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/arrivals_mob_initial.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/arrivals_mob_initial.png');

  // Emulate touch swipe from x=320, y=420 to x=80, y=420
  await send(5, 'Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 320, y: 420 }]
  });
  for (let i = 1; i <= 10; i++) {
    const curX = 320 - (240 / 10) * i;
    await send(10 + i, 'Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: Math.round(curX), y: 420 }]
    });
    await new Promise(r => setTimeout(r, 20));
  }
  await send(25, 'Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: []
  });

  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot 2 after swipe
  snap = await send(26, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/arrivals_mob_swipe1.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/arrivals_mob_swipe1.png');

  ws.close();
  chrome.kill();
  console.log('Done!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
