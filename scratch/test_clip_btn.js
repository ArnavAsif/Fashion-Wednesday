const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function testBtnClip() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9422',
    '--window-size=1600,1000',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9422/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(id, method, params = {}) {
    return new Promise(res => {
      const h = msg => {
        const data = JSON.parse(msg.data);
        if (data.id === id) { ws.removeEventListener('message', h); res(data.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // 1. Force goToAndStop(18) on [ M ]
  const rectM = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      const btnM = btns.find(b => b.textContent.includes('M'));
      const anim = btnM.querySelector('.marker-lottie-layer').__lottieAnim;
      anim.goToAndStop(18, true);
      const r = btnM.getBoundingClientRect();
      return { x: r.left - 20, y: r.top - 20, width: r.width + 40, height: r.height + 40 };
    })()`,
    returnByValue: true
  });

  console.log('rectM:', rectM.result.value);

  const clip = rectM.result.value;
  const snapM = await send(2, 'Page.captureScreenshot', {
    clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 2 }
  });
  fs.writeFileSync('scratch/clip_btn_m_frame18.png', Buffer.from(snapM.data, 'base64'));
  console.log('Saved scratch/clip_btn_m_frame18.png');

  // 2. Force goToAndStop(18) on SIZE GUIDE
  const rectGuide = await send(3, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      const btn = btns.find(b => b.textContent.includes('SIZE GUIDE'));
      const anim = btn.querySelector('.marker-lottie-layer').__lottieAnim;
      anim.goToAndStop(18, true);
      const r = btn.getBoundingClientRect();
      return { x: r.left - 15, y: r.top - 15, width: r.width + 30, height: r.height + 30 };
    })()`,
    returnByValue: true
  });
  const clipGuide = rectGuide.result.value;
  const snapGuide = await send(4, 'Page.captureScreenshot', {
    clip: { x: clipGuide.x, y: clipGuide.y, width: clipGuide.width, height: clipGuide.height, scale: 2 }
  });
  fs.writeFileSync('scratch/clip_btn_guide_frame18.png', Buffer.from(snapGuide.data, 'base64'));
  console.log('Saved scratch/clip_btn_guide_frame18.png');

  // 3. Force goToAndStop(18) on DETAILS
  const rectDet = await send(5, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      const btn = btns.find(b => b.textContent.includes('DETAILS'));
      const anim = btn.querySelector('.marker-lottie-layer').__lottieAnim;
      anim.goToAndStop(18, true);
      const r = btn.getBoundingClientRect();
      return { x: r.left - 20, y: r.top - 20, width: r.width + 40, height: r.height + 40 };
    })()`,
    returnByValue: true
  });
  console.log('rectDet:', rectDet.result.value);
  const clipDet = rectDet.result.value;
  const snapDet = await send(4, 'Page.captureScreenshot', {
    clip: { x: clipDet.x, y: clipDet.y, width: clipDet.width, height: clipDet.height, scale: 2 }
  });
  fs.writeFileSync('scratch/clip_btn_details_frame18.png', Buffer.from(snapDet.data, 'base64'));
  console.log('Saved scratch/clip_btn_details_frame18.png');

  chrome.kill();
  process.exit(0);
}
testBtnClip();
