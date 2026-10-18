const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testDesktop() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9453',
    '--window-size=1440,900',
    '--disable-gpu',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9453/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const target = json.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((res, rej) => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        if (data.error) rej(data.error); else res(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    const isReady = await send('Runtime.evaluate', { expression: 'Boolean(window.__lenis)', returnByValue: true });
    if (isReady.result.value) break;
  }
  await new Promise(r => setTimeout(r, 1000));

  // Open CATEGORIES
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const catBtn = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent && b.textContent.includes('CATEGORIES'));
        if (catBtn) catBtn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  // Hover BODYS
  await send('Runtime.evaluate', {
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
  await new Promise(r => setTimeout(r, 1200));

  const deskStatus = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const activeItem = document.querySelector('.menu--categories .menu__item.active:not(.default)');
        const vid = activeItem ? activeItem.querySelector('video') : null;
        if (!vid) return { found: false };
        const rect = vid.getBoundingClientRect();
        return {
          found: true,
          src: vid.src,
          currentTime: vid.currentTime,
          paused: vid.paused,
          rect: { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Desktop BODYS video status:', deskStatus.result.value);

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_desk_categories_bodys.png', Buffer.from(snap.data, 'base64'));

  chrome.kill();
}
testDesktop();
