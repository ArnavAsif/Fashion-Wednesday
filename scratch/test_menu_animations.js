const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testAnimations() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9341',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9341/json', r => {
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

  // Click CATEGORIES +
  await send(1, 'Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
        const catEl = els.find(b => b.textContent && b.textContent.trim().startsWith('CATEGORIES'));
        if (catEl) catEl.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));
  let snap = await send(2, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_cat_opened.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_desk_cat_opened.png');

  // Hover BODYS
  await send(3, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.menu--categories .menu__list button'));
        const b = btns.find(el => el.textContent && el.textContent.includes('BODYS'));
        if (b) {
          b.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
          b.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          b.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 600));
  snap = await send(4, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_cat_bodys_hovered.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_desk_cat_bodys_hovered.png');

  // Now switch to MENU tab by clicking MENU + in header
  await send(5, 'Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
        const menuEl = els.find(b => b.textContent && b.textContent.trim().startsWith('MENU'));
        if (menuEl) menuEl.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 600));
  snap = await send(6, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_switch_to_menu.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_desk_switch_to_menu.png');

  // Now close menu by clicking MENU -
  await send(7, 'Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
        const menuEl = els.find(b => b.textContent && b.textContent.trim().startsWith('MENU'));
        if (menuEl) menuEl.click();
      })()
    `
  });

  // Capture close at 250ms (items squishing horizontally/vertically)
  await new Promise(r => setTimeout(r, 250));
  snap = await send(8, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_closing_items_collapsing.png', Buffer.from(snap.data, 'base64'));

  // Capture close at 750ms (curtain rolling up)
  await new Promise(r => setTimeout(r, 500));
  snap = await send(9, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_closing_curtain_rolling_up.png', Buffer.from(snap.data, 'base64'));

  // Settle close
  await new Promise(r => setTimeout(r, 700));
  snap = await send(10, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_desk_closed_complete.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved all desktop animation snapshots!');

  // NOW TEST MOBILE VIEWPORT (390 x 844)
  await send(11, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  // Open CATEGORIES on mobile
  await send(12, 'Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
        const catEl = els.find(b => b.textContent && b.textContent.trim().startsWith('CATEGORIES'));
        if (catEl) catEl.click();
      })()
    `
  });

  // Capture open at 300ms (mobile curtain rolling down)
  await new Promise(r => setTimeout(r, 300));
  snap = await send(13, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_mobile_open_curtain_rolling_down.png', Buffer.from(snap.data, 'base64'));

  // Mobile settled
  await new Promise(r => setTimeout(r, 900));
  snap = await send(14, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_mobile_cat_opened_settled.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved snap_mobile_cat_opened_settled.png');

  // Close mobile
  await send(15, 'Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
        const catEl = els.find(b => b.textContent && b.textContent.trim().startsWith('CATEGORIES'));
        if (catEl) catEl.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 250));
  snap = await send(16, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_mobile_closing_items_collapsing.png', Buffer.from(snap.data, 'base64'));

  await new Promise(r => setTimeout(r, 600));
  snap = await send(17, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/snap_mobile_closing_curtain_rolling_up.png', Buffer.from(snap.data, 'base64'));

  ws.close();
  chrome.kill();
}

testAnimations();
