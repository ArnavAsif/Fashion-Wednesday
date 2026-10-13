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

async function verifyAll() {
  console.log('--- 1. Testing Desktop (1440x900) ---');
  let chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9301',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  let json = await new Promise(res => http.get('http://127.0.0.1:9301/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  let ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1500));

  // Check Motion section initial
  await send(ws, 1, 'Runtime.evaluate', {
    expression: 'document.getElementById("film").scrollIntoView({ behavior: "instant" });'
  });
  await new Promise(r => setTimeout(r, 800));
  let snap = await send(ws, 2, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/final_motion_check.png', Buffer.from(snap.data, 'base64'));

  // Scroll to Footer
  await send(ws, 3, 'Runtime.evaluate', {
    expression: 'document.querySelector(".footer__discount").scrollIntoView({ behavior: "instant", block: "center" });'
  });
  await new Promise(r => setTimeout(r, 1000));

  // Verify DOM has NO canvas or video inside footer discount
  const domCheck = await send(ws, 4, 'Runtime.evaluate', {
    expression: `(() => {
      const d = document.querySelector('.footer__discount');
      const btn = document.querySelector('.footer__discount-btn');
      const base = document.querySelector('.footer__discount-base');
      const rev = document.querySelector('.footer__discount-reveal');
      return {
        hasDiscountContainer: !!d,
        hasButton: !!btn,
        baseText: base ? base.textContent : null,
        revealText: rev ? rev.textContent : null,
        hasCanvas: !!(d && d.querySelector('canvas')),
        hasVideo: !!(d && d.querySelector('video')),
      };
    })()`,
    returnByValue: true
  });
  console.log('DOM check desktop:', domCheck.result.value);

  // Capture Desktop Initial
  snap = await send(ws, 5, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/final_desktop_footer_initial.png', Buffer.from(snap.data, 'base64'));

  // Trigger Hover over .footer__discount-btn
  await send(ws, 6, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.footer__discount-btn');
      if (btn) btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  // Capture Desktop Hovered
  snap = await send(ws, 7, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/final_desktop_footer_hovered.png', Buffer.from(snap.data, 'base64'));

  // Trigger Mouse Leave
  await send(ws, 8, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.footer__discount-btn');
      if (btn) btn.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  // Capture Desktop Unhovered
  snap = await send(ws, 9, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/final_desktop_footer_unhovered.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();

  console.log('--- 2. Testing Mobile (375x812) ---');
  chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9302',
    '--window-size=375,812',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  json = await new Promise(res => http.get('http://127.0.0.1:9302/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1500));

  await send(ws, 10, 'Runtime.evaluate', {
    expression: 'document.querySelector(".footer__discount").scrollIntoView({ behavior: "instant", block: "center" });'
  });
  await new Promise(r => setTimeout(r, 1000));

  snap = await send(ws, 11, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/final_mobile_footer_initial.png', Buffer.from(snap.data, 'base64'));

  await send(ws, 12, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.footer__discount-btn');
      if (btn) btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    })()`
  });
  await new Promise(r => setTimeout(r, 500));

  snap = await send(ws, 13, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/final_mobile_footer_hovered.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();

  console.log('All verifications complete!');
}

verifyAll().catch(console.error);
