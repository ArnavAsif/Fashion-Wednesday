const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testDesktop() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9332',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9332/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(id, method, params = {}) {
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

  // Click CATEGORIES button (which is .marker-btn-root)
  const clicked = await send(1, 'Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
        const catEl = els.find(b => b.textContent && b.textContent.trim().startsWith('CATEGORIES'));
        if (catEl) {
          catEl.click();
          return 'Clicked ' + catEl.textContent;
        }
        return 'Not found';
      })()
    `,
    returnByValue: true
  }).then(r => r.result.value);

  console.log('Desktop click result:', clicked);
  await new Promise(r => setTimeout(r, 1000));

  let snap = await send(2, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_cat_initial.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_desk_cat_initial.png');

  // Hover over BODYS
  await send(3, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.categories-menu-list button'));
        const bodysBtn = btns.find(b => b.textContent && b.textContent.includes('BODYS'));
        if (bodysBtn) {
          bodysBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          return 'Hovered BODYS';
        }
        return 'BODYS not found';
      })()
    `,
    returnByValue: true
  }).then(r => console.log('Desktop hover result:', r.result.value));
  await new Promise(r => setTimeout(r, 600));

  snap = await send(4, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_cat_bodys.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_desk_cat_bodys.png');

  // Hover over COATS
  await send(5, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.categories-menu-list button'));
        const coatsBtn = btns.find(b => b.textContent && b.textContent.includes('COATS'));
        if (coatsBtn) {
          coatsBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          return 'Hovered COATS';
        }
        return 'COATS not found';
      })()
    `,
    returnByValue: true
  }).then(r => console.log('Desktop hover coats:', r.result.value));
  await new Promise(r => setTimeout(r, 600));

  snap = await send(6, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_cat_coats.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_desk_cat_coats.png');

  ws.close();
  chrome.kill();
}

async function testMobile() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9333',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9333/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(id, method, params = {}) {
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

  await send(1, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Click CATEGORIES button
  const clicked = await send(2, 'Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
        const catEl = els.find(b => b.textContent && b.textContent.trim().startsWith('CATEGORIES'));
        if (catEl) {
          catEl.click();
          return 'Clicked ' + catEl.textContent;
        }
        return 'Not found';
      })()
    `,
    returnByValue: true
  }).then(r => r.result.value);

  console.log('Mobile click result:', clicked);
  await new Promise(r => setTimeout(r, 1000));

  let snap = await send(3, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_mob_cat_initial.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_mob_cat_initial.png');

  // Tap DRESSES
  await send(4, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.categories-menu-list button'));
        const dressesBtn = btns.find(b => b.textContent && b.textContent.includes('DRESSES'));
        if (dressesBtn) {
          dressesBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          return 'Hovered DRESSES';
        }
        return 'DRESSES not found';
      })()
    `,
    returnByValue: true
  }).then(r => console.log('Mobile hover dresses:', r.result.value));
  await new Promise(r => setTimeout(r, 600));

  snap = await send(5, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_mob_cat_dresses.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_mob_cat_dresses.png');

  ws.close();
  chrome.kill();
}

async function run() {
  await testDesktop();
  await testMobile();
}
run();
