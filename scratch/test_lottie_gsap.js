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
    '--remote-debugging-port=9340',
    '--window-size=1000,700',
    'http://localhost:3000/test_lottie_gsap.html'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9340/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1500));

  // 1. Initial state
  const initial = await send(ws, 1, 'Runtime.evaluate', {
    expression: 'window.anim ? { frame: Math.round(window.anim.currentFrame), status: document.getElementById("status").innerText } : null',
    returnByValue: true
  });
  console.log('1. Initial state:', initial.result.value);

  let snap = await send(ws, 2, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/gsap_step1_initial.png', Buffer.from(snap.data, 'base64'));

  // 2. Hover in
  await send(ws, 3, 'Runtime.evaluate', {
    expression: 'document.getElementById("wrapper").dispatchEvent(new MouseEvent("mouseenter"));'
  });
  await new Promise(r => setTimeout(r, 600));

  const hovered = await send(ws, 4, 'Runtime.evaluate', {
    expression: 'window.anim ? { frame: Math.round(window.anim.currentFrame), status: document.getElementById("status").innerText } : null',
    returnByValue: true
  });
  console.log('2. Hovered state:', hovered.result.value);

  snap = await send(ws, 5, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/gsap_step2_hovered.png', Buffer.from(snap.data, 'base64'));

  // 3. Hover out
  await send(ws, 6, 'Runtime.evaluate', {
    expression: 'document.getElementById("wrapper").dispatchEvent(new MouseEvent("mouseleave"));'
  });
  await new Promise(r => setTimeout(r, 600));

  const unhovered = await send(ws, 7, 'Runtime.evaluate', {
    expression: 'window.anim ? { frame: Math.round(window.anim.currentFrame), status: document.getElementById("status").innerText } : null',
    returnByValue: true
  });
  console.log('3. Unhovered state:', unhovered.result.value);

  snap = await send(ws, 8, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/gsap_step3_unhovered.png', Buffer.from(snap.data, 'base64'));

  // 4. Test quick interrupt: hover in then hover out after 200ms
  console.log('4. Testing mid-flight interrupt...');
  await send(ws, 9, 'Runtime.evaluate', {
    expression: 'document.getElementById("wrapper").dispatchEvent(new MouseEvent("mouseenter"));'
  });
  await new Promise(r => setTimeout(r, 200));

  const mid = await send(ws, 10, 'Runtime.evaluate', {
    expression: 'window.anim ? { frame: Math.round(window.anim.currentFrame), status: document.getElementById("status").innerText } : null',
    returnByValue: true
  });
  console.log('Mid-flight frame:', mid.result.value);

  await send(ws, 11, 'Runtime.evaluate', {
    expression: 'document.getElementById("wrapper").dispatchEvent(new MouseEvent("mouseleave"));'
  });
  await new Promise(r => setTimeout(r, 600));

  const finalState = await send(ws, 12, 'Runtime.evaluate', {
    expression: 'window.anim ? { frame: Math.round(window.anim.currentFrame), status: document.getElementById("status").innerText } : null',
    returnByValue: true
  });
  console.log('Final state after interrupt:', finalState.result.value);

  ws.close();
  chrome.kill();
  console.log('Done testing GSAP Lottie!');
}
run().catch(console.error);
