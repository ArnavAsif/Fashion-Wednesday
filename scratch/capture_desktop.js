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
    '--remote-debugging-port=9290',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9290/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await send(ws, 1, 'Runtime.evaluate', {
    expression: `
      const f = document.getElementById('footer');
      const m = document.getElementById('film');
      ({
        footerTop: f ? f.offsetTop : null,
        filmTop: m ? m.offsetTop : null,
        filmHeight: m ? m.offsetHeight : null
      })
    `,
    returnByValue: true
  }).then(r => console.log('Offsets:', r.result.value));

  // Scroll to near end of motion section on desktop
  await send(ws, 2, 'Runtime.evaluate', {
    expression: `
      const m = document.getElementById('film');
      if (window.__lenis) window.__lenis.scrollTo(m.offsetTop + m.offsetHeight - 500, { immediate: true });
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  let snap = await send(ws, 3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/desktop_motion_end.png', Buffer.from(snap.data, 'base64'));

  // Scroll to footer on desktop
  await send(ws, 4, 'Runtime.evaluate', {
    expression: `
      const f = document.getElementById('footer');
      if (window.__lenis) window.__lenis.scrollTo(f, { immediate: true });
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  snap = await send(ws, 5, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/desktop_footer_top.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Saved desktop screenshots.');
}

run().catch(console.error);
