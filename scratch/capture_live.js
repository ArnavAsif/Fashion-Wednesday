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

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9244',
    '--window-size=1440,900',
    'https://serotoninn.com'
  ]);
  await new Promise(r => setTimeout(r, 3000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9244/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await send(ws, 1, 'Page.enable');
  await new Promise(r => setTimeout(r, 4000));

  // Scroll to .motion-section
  const evalRes = await send(ws, 2, 'Runtime.evaluate', {
    expression: `(() => {
      const m = document.querySelector('.motion-section');
      if (!m) return null;
      m.scrollIntoView();
      return m.getBoundingClientRect();
    })()`,
    returnByValue: true
  });
  console.log('Motion rect:', evalRes.result.value);

  await new Promise(r => setTimeout(r, 1000));

  const snap1 = await send(ws, 3, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/orig_motion_start.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved orig_motion_start.png');

  // Scroll a bit more
  await send(ws, 4, 'Runtime.evaluate', {
    expression: 'window.scrollBy(0, 400)'
  });
  await new Promise(r => setTimeout(r, 1000));

  const snap2 = await send(ws, 5, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/orig_motion_scroll1.png', Buffer.from(snap2.data, 'base64'));
  console.log('Saved orig_motion_scroll1.png');

  // Scroll to footer
  await send(ws, 6, 'Runtime.evaluate', {
    expression: 'document.querySelector(".footer").scrollIntoView()'
  });
  await new Promise(r => setTimeout(r, 1500));

  const snap3 = await send(ws, 7, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/orig_footer.png', Buffer.from(snap3.data, 'base64'));
  console.log('Saved orig_footer.png');

  ws.close();
  chrome.kill();
}
capture().catch(console.error);
