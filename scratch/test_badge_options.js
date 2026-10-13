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
  await new Promise(r => setTimeout(r, 1500));

  await send(ws, 1, 'Runtime.evaluate', {
    expression: 'document.getElementById("footer").scrollIntoView({ behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 800));

  // Option 1: Brush stroke
  await send(ws, 2, 'Runtime.evaluate', {
    expression: `(() => {
      const d = document.querySelector('.footer__discount');
      if (!d) return;
      d.style.aspectRatio = 'auto';
      d.style.overflow = 'visible';
      d.innerHTML = \`
        <div id="test-btn" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: url('/images/button_bg.webp') no-repeat center / 100% 100%;
          padding: 1.1rem 2.8rem;
          cursor: pointer;
          font-family: Thunder, sans-serif;
          font-size: 2.6rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #fff;
          letter-spacing: 0.08rem;
          line-height: 1;
          user-select: none;
          transition: transform 0.25s ease;
        ">
          <span>Discount</span>
          <span id="test-rev" style="
            display: inline-block;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
            white-space: nowrap;
            transform: translateX(-8px);
            transition: max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), margin-left 0.35s ease;
            margin-left: 0;
          ">10%</span>
        </div>
      \`;
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  // Capture close-up clip of the button
  const clip1 = await send(ws, 3, 'Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('test-btn').getBoundingClientRect();
      return { x: b.x - 20, y: b.y - 20, width: b.width + 120, height: b.height + 40, scale: 1 };
    })()`,
    returnByValue: true
  });

  let snap = await send(ws, 4, 'Page.captureScreenshot', { clip: clip1.result.value });
  fs.writeFileSync('scratch/opt1_brush_initial.png', Buffer.from(snap.data, 'base64'));

  // Hover
  await send(ws, 5, 'Runtime.evaluate', {
    expression: `(() => {
      const rev = document.getElementById('test-rev');
      rev.style.maxWidth = '6rem';
      rev.style.opacity = '1';
      rev.style.transform = 'translateX(0)';
      rev.style.marginLeft = '0.35rem';
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const clip1Hover = await send(ws, 6, 'Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('test-btn').getBoundingClientRect();
      return { x: b.x - 20, y: b.y - 20, width: b.width + 40, height: b.height + 40, scale: 1 };
    })()`,
    returnByValue: true
  });

  snap = await send(ws, 7, 'Page.captureScreenshot', { clip: clip1Hover.result.value });
  fs.writeFileSync('scratch/opt1_brush_hover.png', Buffer.from(snap.data, 'base64'));

  // Option 2: Torn paper cutout badge (dark #1e1e1e with rough torn edge & paper shadow)
  await send(ws, 8, 'Runtime.evaluate', {
    expression: `(() => {
      const d = document.querySelector('.footer__discount');
      d.innerHTML = \`
        <div id="test-btn2" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #18181a;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4), inset 0 0 12px rgba(0,0,0,0.6);
          padding: 1.1rem 2.2rem;
          cursor: pointer;
          font-family: Thunder, sans-serif;
          font-size: 2.6rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #fff;
          letter-spacing: 0.08rem;
          line-height: 1;
          user-select: none;
          clip-path: polygon(0% 4%, 5% 0%, 95% 3%, 100% 0%, 98% 94%, 93% 100%, 7% 97%, 0% 100%);
        ">
          <span>Discount</span>
          <span id="test-rev2" style="
            display: inline-block;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
            white-space: nowrap;
            transform: translateX(-8px);
            margin-left: 0;
          ">10%</span>
        </div>
      \`;
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const clip2 = await send(ws, 9, 'Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('test-btn2').getBoundingClientRect();
      return { x: b.x - 20, y: b.y - 20, width: b.width + 120, height: b.height + 40, scale: 1 };
    })()`,
    returnByValue: true
  });
  snap = await send(ws, 10, 'Page.captureScreenshot', { clip: clip2.result.value });
  fs.writeFileSync('scratch/opt2_torn_initial.png', Buffer.from(snap.data, 'base64'));

  // Option 2 hover
  await send(ws, 11, 'Runtime.evaluate', {
    expression: `(() => {
      const rev = document.getElementById('test-rev2');
      rev.style.maxWidth = '6rem';
      rev.style.opacity = '1';
      rev.style.transform = 'translateX(0)';
      rev.style.marginLeft = '0.35rem';
    })()`
  });
  await new Promise(r => setTimeout(r, 400));
  const clip2Hover = await send(ws, 12, 'Runtime.evaluate', {
    expression: `(() => {
      const b = document.getElementById('test-btn2').getBoundingClientRect();
      return { x: b.x - 20, y: b.y - 20, width: b.width + 40, height: b.height + 40, scale: 1 };
    })()`,
    returnByValue: true
  });
  snap = await send(ws, 13, 'Page.captureScreenshot', { clip: clip2Hover.result.value });
  fs.writeFileSync('scratch/opt2_torn_hover.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Done testing badge options!');
}
run().catch(console.error);
