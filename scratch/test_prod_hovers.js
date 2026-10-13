const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function testHovers() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9466',
    '--window-size=1600,1000',
    'http://localhost:3000/products/classic-knit-maxi-dress'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9466/json', r => {
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

  // 1. Initial snapshot
  let snap1 = await send(1, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_initial.png', Buffer.from(snap1.data, 'base64'));
  console.log('Saved scratch/snap_initial.png');

  // 2. Hover over size [ M ]
  await send(2, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      const btnM = btns.find(b => b.textContent.includes('M'));
      if (btnM) {
        btnM.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        return true;
      }
      return false;
    })()`
  });
  await new Promise(r => setTimeout(r, 400));
  let snap2 = await send(3, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_hover_m.png', Buffer.from(snap2.data, 'base64'));
  console.log('Saved scratch/snap_hover_m.png');

  // Unhover M
  await send(4, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      const btnM = btns.find(b => b.textContent.includes('M'));
      if (btnM) btnM.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    })()`
  });

  // 3. Hover over SIZE GUIDE
  await send(5, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      const btnGuide = btns.find(b => b.textContent.includes('SIZE GUIDE'));
      if (btnGuide) {
        btnGuide.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        return true;
      }
      return false;
    })()`
  });
  await new Promise(r => setTimeout(r, 400));
  let snap3 = await send(6, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_hover_guide.png', Buffer.from(snap3.data, 'base64'));
  console.log('Saved scratch/snap_hover_guide.png');

  // 4. Hover over 01. DETAILS
  await send(7, 'Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.marker-btn-root'));
      const btnDet = btns.find(b => b.textContent.includes('DETAILS'));
      if (btnDet) {
        btnDet.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        return true;
      }
      return false;
    })()`
  });
  await new Promise(r => setTimeout(r, 400));
  let snap4 = await send(8, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/snap_hover_details.png', Buffer.from(snap4.data, 'base64'));
  console.log('Saved scratch/snap_hover_details.png');

  chrome.kill();
  process.exit(0);
}

testHovers().catch(e => { console.error(e); process.exit(1); });
