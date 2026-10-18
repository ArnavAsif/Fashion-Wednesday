const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testMobileAndHero() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9452',
    '--window-size=390,844',
    '--disable-gpu',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const json = await new Promise(res => http.get('http://127.0.0.1:9452/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const target = json.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function send(method, params = {}) {
    const id = msgId++;
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

  // Set mobile device emulation (iPhone 14 / standard mobile)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log('1. Navigating to home...');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  // Wait for hydration
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    const isReady = await send('Runtime.evaluate', {
      expression: 'Boolean(window.__lenis && document.querySelector(".marker-btn-root"))',
      returnByValue: true
    });
    if (isReady.result.value) {
      console.log('Page ready and hydrated at attempt', i + 1);
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // Click CATEGORIES +
  console.log('2. Clicking CATEGORIES + on mobile...');
  const clickRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const catBtn = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent && b.textContent.includes('CATEGORIES'));
        if (catBtn) {
          const r = catBtn.getBoundingClientRect();
          catBtn.click();
          return { found: true, text: catBtn.textContent, x: r.x + r.width/2, y: r.y + r.height/2 };
        }
        return { found: false, all: Array.from(document.querySelectorAll('.marker-btn-root')).map(b => b.textContent) };
      })()
    `,
    returnByValue: true
  });
  console.log('Click button res:', clickRes.result.value);

  await new Promise(r => setTimeout(r, 1500));

  // Check video status in Categories default state
  const defaultStatus = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const activeItem = document.querySelector('.menu--categories .menu__item.default.active');
        const vid = activeItem ? activeItem.querySelector('video') : null;
        if (!vid) return { found: false };
        const rect = vid.getBoundingClientRect();
        return {
          found: true,
          src: vid.src,
          currentSrc: vid.currentSrc,
          currentTime: vid.currentTime,
          paused: vid.paused,
          readyState: vid.readyState,
          rect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left }
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Categories Default Video Status:', defaultStatus.result.value);

  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_mobile_categories_default.png', Buffer.from(snap.data, 'base64'));

  // Tap "BODYS"
  console.log('3. Tapping BODYS category...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('.menu--categories .menu__list button'));
        const b = btns.find(el => el.textContent && el.textContent.includes('BODYS'));
        if (b) b.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  const bodysStatus = await send('Runtime.evaluate', {
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
          rect: { width: rect.width, height: rect.height }
        };
      })()
    `,
    returnByValue: true
  });
  console.log('BODYS Category Video Status:', bodysStatus.result.value);

  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_mobile_categories_bodys.png', Buffer.from(snap.data, 'base64'));

  // Click MENU +
  console.log('4. Clicking MENU tab...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const menuBtn = Array.from(document.querySelectorAll('.marker-btn-root')).find(b => b.textContent && b.textContent.includes('MENU'));
        if (menuBtn) {
          menuBtn.click();
          return true;
        }
        return false;
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  const menuStatus = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const activeItem = document.querySelector('.menu:not(.menu--categories) .menu__item.active');
        const vid = activeItem ? activeItem.querySelector('video') : null;
        if (!vid) return { found: false };
        const rect = vid.getBoundingClientRect();
        return {
          found: true,
          src: vid.src,
          currentTime: vid.currentTime,
          paused: vid.paused,
          rect: { width: rect.width, height: rect.height }
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Menu Tab Video Status:', menuStatus.result.value);

  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_mobile_menu.png', Buffer.from(snap.data, 'base64'));

  chrome.kill();
  console.log('Done test!');
}

testMobileAndHero().catch(e => {
  console.error(e);
  process.exit(1);
});
