const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function testRealHover() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9488',
    '--window-size=1600,1000',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9488/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1000));

  function send(id, method, params = {}) {
    return new Promise((resolve) => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // 1. Get exact element center coordinates
  const coords = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      function getCenter(el) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, width: r.width, height: r.height };
      }
      return {
        btnM: getCenter(btns.find(b => b.textContent.trim() === '[M]' || b.textContent.trim() === 'M' || b.textContent.trim() === '[ M ]')),
        btnGuide: getCenter(btns.find(b => b.textContent.includes('SIZE GUIDE'))),
        btnDetails: getCenter(btns.find(b => b.textContent.includes('DETAILS'))),
      };
    })()`,
    returnByValue: true
  });

  const { btnM, btnGuide, btnDetails } = coords.result.value;
  console.log('Coordinates:', { btnM, btnGuide, btnDetails });

  // 2. Move mouse to btnM
  await send(2, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: Math.round(btnM.x),
    y: Math.round(btnM.y),
  });
  await new Promise(r => setTimeout(r, 500));
  let snapM = await send(3, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_real_hover_m.png', Buffer.from(snapM.data, 'base64'));
  console.log('Saved scratch/snap_real_hover_m.png');

  // 3. Move mouse to btnDetails
  await send(4, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: Math.round(btnDetails.x),
    y: Math.round(btnDetails.y),
  });
  await new Promise(r => setTimeout(r, 500));
  let snapDet = await send(5, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_real_hover_details.png', Buffer.from(snapDet.data, 'base64'));
  console.log('Saved scratch/snap_real_hover_details.png');

  // 4. Move mouse to btnGuide
  await send(6, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: Math.round(btnGuide.x),
    y: Math.round(btnGuide.y),
  });
  await new Promise(r => setTimeout(r, 500));
  let snapGuide = await send(7, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_real_hover_guide.png', Buffer.from(snapGuide.data, 'base64'));
  console.log('Saved scratch/snap_real_hover_guide.png');

  chrome.kill();
  process.exit(0);
}

testRealHover().catch(e => { console.error(e); process.exit(1); });
