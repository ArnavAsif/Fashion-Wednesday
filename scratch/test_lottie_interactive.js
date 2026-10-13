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
    '--remote-debugging-port=9333',
    '--window-size=1000,700',
    'http://localhost:3000/test_lottie_interactive.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9333/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1500));

  // 1. Initial state (should be stopped at frame 58)
  const initial = await send(ws, 1, 'Runtime.evaluate', {
    expression: 'window.anim ? { frame: Math.round(window.anim.currentFrame), isLoaded: window.anim.isLoaded } : null',
    returnByValue: true
  });
  console.log('Initial state:', initial.result.value);

  let snap = await send(ws, 2, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/lottie_step1_initial.png', Buffer.from(snap.data, 'base64'));

  // 2. Trigger mouseenter
  await send(ws, 3, 'Runtime.evaluate', {
    expression: 'document.getElementById("wrapper").dispatchEvent(new MouseEvent("mouseenter"));'
  });
  console.log('Dispatched mouseenter');

  // Wait 700ms for forward animation to complete
  await new Promise(r => setTimeout(r, 800));

  const hovered = await send(ws, 4, 'Runtime.evaluate', {
    expression: 'window.anim ? { frame: Math.round(window.anim.currentFrame), isPaused: window.anim.isPaused } : null',
    returnByValue: true
  });
  console.log('Hovered state:', hovered.result.value);

  snap = await send(ws, 5, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/lottie_step2_hovered.png', Buffer.from(snap.data, 'base64'));

  // 3. Trigger mouseleave
  await send(ws, 6, 'Runtime.evaluate', {
    expression: 'document.getElementById("wrapper").dispatchEvent(new MouseEvent("mouseleave"));'
  });
  console.log('Dispatched mouseleave');

  // Wait 800ms for reverse animation to complete
  await new Promise(r => setTimeout(r, 800));

  const unhovered = await send(ws, 7, 'Runtime.evaluate', {
    expression: 'window.anim ? { frame: Math.round(window.anim.currentFrame), isPaused: window.anim.isPaused } : null',
    returnByValue: true
  });
  console.log('Unhovered state:', unhovered.result.value);

  snap = await send(ws, 8, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/lottie_step3_unhovered.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Done testing interactive Lottie!');
}
run().catch(console.error);
