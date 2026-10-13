const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9499',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9499/json', r => {
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

  const res = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent.includes('DETAILS'));
      const container = btn.querySelector('.marker-lottie-layer');
      const anim = container ? container.__lottieAnim : null;
      if (!anim) return { error: 'No anim on container' };
      return {
        isLoaded: anim.isLoaded,
        currentFrame: anim.currentFrame,
        totalFrames: anim.totalFrames,
        playDirection: anim.playDirection,
        isPaused: anim.isPaused
      };
    })()`,
    returnByValue: true
  });
  console.log('Anim status before:', res.result.value);

  // Trigger play
  await send(2, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent.includes('DETAILS'));
      const container = btn.querySelector('.marker-lottie-layer');
      const anim = container.__lottieAnim;
      anim.goToAndStop(18, true);
      btn.scrollIntoView({ block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const snap = await send(3, 'Page.captureScreenshot', {});
  const fs = require('fs');
  fs.writeFileSync('scratch/snap_forced_frame18.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/snap_forced_frame18.png');

  chrome.kill();
  process.exit(0);
}
test();
