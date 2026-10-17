const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9295',
    '--allow-file-access-from-files',
    '--window-size=390,844',
    'file:///C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html'
  ]);
  await new Promise(r => setTimeout(r, 3000));
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

  await send(1, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await new Promise(r => setTimeout(r, 1000));

  await send(2, 'Runtime.evaluate', {
    expression: `
      const f = document.querySelector('.footer');
      if (f) f.scrollIntoView({ behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const snap = await send(3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/original_dump_mobile_footer.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved original_dump_mobile_footer.png');

  ws.close();
  chrome.kill();
}
run();
