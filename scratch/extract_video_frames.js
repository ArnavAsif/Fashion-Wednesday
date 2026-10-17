const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function extractVideoFrames() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9337',
    '--allow-file-access-from-files',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9337/json', r => {
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

  // Load video in HTML page
  const html = `
    <html>
      <body style="margin:0;background:#000;">
        <video id="v" src="file:///C:/Users/ifas0/Downloads/Recording%202026-10-17%20133111.mp4" controls muted style="width:100%;height:100%;"></video>
        <canvas id="c" style="display:none;"></canvas>
      </body>
    </html>
  `;

  await send(1, 'Page.navigate', {
    url: 'data:text/html;base64,' + Buffer.from(html).toString('base64')
  });
  await new Promise(r => setTimeout(r, 2000));

  const duration = await send(2, 'Runtime.evaluate', {
    expression: `
      new Promise(res => {
        const v = document.getElementById('v');
        if (v.readyState >= 1) res(v.duration);
        else v.onloadedmetadata = () => res(v.duration);
      })
    `,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Video duration:', duration.value);
  const total = duration.value || 17;

  // Extract frames every 0.3 seconds
  let id = 10;
  for (let t = 0; t <= total; t += 0.3) {
    const timeStr = t.toFixed(2);
    const frameData = await send(++id, 'Runtime.evaluate', {
      expression: `
        new Promise(res => {
          const v = document.getElementById('v');
          const c = document.getElementById('c');
          v.currentTime = ${t};
          v.onseeked = () => {
            c.width = v.videoWidth || 1280;
            c.height = v.videoHeight || 720;
            const ctx = c.getContext('2d');
            ctx.drawImage(v, 0, 0, c.width, c.height);
            res(c.toDataURL('image/png').split(',')[1]);
          };
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });

    if (frameData.value) {
      fs.writeFileSync(`scratch/vframe_${timeStr}.png`, Buffer.from(frameData.value, 'base64'));
      console.log(`Saved vframe_${timeStr}.png`);
    }
  }

  ws.close();
  chrome.kill();
}

extractVideoFrames();
