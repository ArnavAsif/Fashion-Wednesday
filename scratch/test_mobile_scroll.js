const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9293',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9293/json', r => {
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

  const mTop = await send(2, 'Runtime.evaluate', {
    expression: 'document.getElementById("film").offsetTop',
    returnByValue: true
  }).then(r => r.result.value);

  const fTop = await send(3, 'Runtime.evaluate', {
    expression: 'document.getElementById("footer").offsetTop',
    returnByValue: true
  }).then(r => r.result.value);

  console.log('film top:', mTop, 'footer top:', fTop);

  // Scroll through in 6 steps from mTop to fTop + 200
  let step = 0;
  for (let y = mTop; y <= fTop + 300; y += (fTop - mTop) / 6) {
    step++;
    await send(10 + step, 'Runtime.evaluate', {
      expression: `
        if (window.__lenis) window.__lenis.scrollTo(${y}, { immediate: true });
        else window.scrollTo(0, ${y});
      `
    });
    await new Promise(r => setTimeout(r, 600));
    const snap = await send(100 + step, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/mobile_scroll_step_${step}.png`, Buffer.from(snap.data, 'base64'));
    console.log(`Saved step ${step} at y=${Math.round(y)}`);
  }

  ws.close();
  chrome.kill();
}
run();
