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

async function verify() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9262',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9262/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 2000));

  // 1. Scroll to motion section
  await send(ws, 1, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('film');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const snap1 = await send(ws, 2, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/verify_motion_initial.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved verify_motion_initial.png');

  // 2. Scroll a little down into motion section (progress ~0.3)
  await send(ws, 3, 'Runtime.evaluate', {
    expression: 'window.scrollBy(0, 500)'
  });
  await new Promise(r => setTimeout(r, 800));

  const snap2 = await send(ws, 4, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/verify_motion_expanding.png', Buffer.from(snap2.data, 'base64'));
  console.log('Saved verify_motion_expanding.png');

  // 3. Scroll more into motion section (progress ~0.8)
  await send(ws, 5, 'Runtime.evaluate', {
    expression: 'window.scrollBy(0, 700)'
  });
  await new Promise(r => setTimeout(r, 800));

  const snap3 = await send(ws, 6, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/verify_motion_fullscreen.png', Buffer.from(snap3.data, 'base64'));
  console.log('Saved verify_motion_fullscreen.png');

  // 4. Scroll to footer
  await send(ws, 7, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('footer');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  const snap4 = await send(ws, 8, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/verify_footer_initial.png', Buffer.from(snap4.data, 'base64'));
  console.log('Saved verify_footer_initial.png');

  // Wait 2 seconds to ensure no auto-looping
  await new Promise(r => setTimeout(r, 2000));
  const snap5 = await send(ws, 9, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/verify_footer_still_initial.png', Buffer.from(snap5.data, 'base64'));
  console.log('Saved verify_footer_still_initial.png');

  // Hover over footer__discount
  await send(ws, 10, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.footer__discount');
      if (el) el.dispatchEvent(new MouseEvent('mouseenter'));
    })()`
  });
  await new Promise(r => setTimeout(r, 700));

  const snap6 = await send(ws, 11, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/verify_footer_hovered.png', Buffer.from(snap6.data, 'base64'));
  console.log('Saved verify_footer_hovered.png');

  // Mouse leave
  await send(ws, 12, 'Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.footer__discount');
      if (el) el.dispatchEvent(new MouseEvent('mouseleave'));
    })()`
  });
  await new Promise(r => setTimeout(r, 700));

  const snap7 = await send(ws, 13, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/verify_footer_unhovered.png', Buffer.from(snap7.data, 'base64'));
  console.log('Saved verify_footer_unhovered.png');

  ws.close();
  chrome.kill();
}
verify().catch(console.error);
