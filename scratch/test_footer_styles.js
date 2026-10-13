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
    '--remote-debugging-port=9285',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9285/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1500));

  // scroll to footer
  await send(ws, 1, 'Runtime.evaluate', {
    expression: 'document.getElementById("footer").scrollIntoView({ behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 1000));

  // Test Option 1: Brush stroke background
  await send(ws, 2, 'Runtime.evaluate', {
    expression: `(() => {
      const d = document.querySelector('.footer__discount');
      if (!d) return;
      d.innerHTML = \`
        <div class="custom-discount-btn" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: url('/images/button_bg.webp') no-repeat center / 100% 100%;
          padding: 1.2rem 2.8rem;
          cursor: pointer;
          font-family: Thunder, sans-serif;
          font-size: 2.6rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #fff;
          letter-spacing: 0.08rem;
          line-height: 1;
          user-select: none;
        ">
          <span style="display: inline-block;">DISCOUNT</span>
          <span class="reveal-part" style="
            display: inline-block;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
            white-space: nowrap;
            transform: translateX(-8px);
            transition: max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), margin-left 0.35s ease;
            margin-left: 0;
          "> 10%</span>
        </div>
      \`;
      d.style.aspectRatio = 'auto';
      d.style.overflow = 'visible';
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  let snap = await send(ws, 3, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/style_brush_initial.png', Buffer.from(snap.data, 'base64'));

  // Trigger hover
  await send(ws, 4, 'Runtime.evaluate', {
    expression: `(() => {
      const rev = document.querySelector('.reveal-part');
      if (rev) {
        rev.style.maxWidth = '6rem';
        rev.style.opacity = '1';
        rev.style.transform = 'translateX(0)';
        rev.style.marginLeft = '0.4rem';
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  snap = await send(ws, 5, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/style_brush_hover.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Saved brush screenshots!');
}
run().catch(console.error);
