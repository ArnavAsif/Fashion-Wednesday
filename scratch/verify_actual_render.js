const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testDesktop() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9310',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9310/json', r => {
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

  console.log('Desktop footer top:', fTop);

  await send(2, 'Runtime.evaluate', {
    expression: `
      if (window.__lenis) window.__lenis.scrollTo(${fTop + 200}, { immediate: true });
      else window.scrollTo(0, ${fTop + 200});
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const snap = await send(3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/final_desk_footer.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/final_desk_footer.png');

  ws.close();
  chrome.kill();
}

async function testMobile() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9311',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9311/json', r => {
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

  console.log('Mobile footer top:', fTop);

  await send(3, 'Runtime.evaluate', {
    expression: `
      if (window.__lenis) window.__lenis.scrollTo(${fTop + 400}, { immediate: true });
      else window.scrollTo(0, ${fTop + 400});
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  const snap = await send(4, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/final_mob_footer.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/final_mob_footer.png');

  ws.close();
  chrome.kill();
}

async function run() {
  await testDesktop();
  await testMobile();
}
run();
