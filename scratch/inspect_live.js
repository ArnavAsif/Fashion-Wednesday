const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function inspectLiveSerotoninn() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9336',
    '--window-size=1440,900',
    'https://serotoninn.com/'
  ]);
  await new Promise(r => setTimeout(r, 4000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9336/json', r => {
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

  // Wait for loader to finish
  await new Promise(r => setTimeout(r, 4000));

  // Inspect DOM of .menu and header
  const inspectRes = await send(1, 'Runtime.evaluate', {
    expression: `
      (() => {
        const menuEl = document.querySelector('.menu--menu');
        const catEl = document.querySelector('.menu--categories');
        const headerList = document.querySelector('.header__list');
        return {
          menuClasses: menuEl ? menuEl.className : null,
          catClasses: catEl ? catEl.className : null,
          headerItems: headerList ? Array.from(headerList.children).map(li => li.innerText.trim()) : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Inspect result:', inspectRes.value);

  // Take screenshot before click
  let snap = await send(2, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/live_before_menu.png', Buffer.from(snap.data, 'base64'));

  // Click MENU
  await send(3, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.header__list > li:first-child button');
        if (btn) btn.click();
      })()
    `
  });

  // Capture snapshots during open animation at 100ms, 300ms, 600ms, 900ms
  for (let delay of [100, 300, 600, 900, 1400]) {
    await new Promise(r => setTimeout(r, 200));
    let s = await send(10 + delay, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/live_menu_open_${delay}ms.png`, Buffer.from(s.data, 'base64'));
    console.log(`Saved live_menu_open_${delay}ms.png`);
  }

  // Now click CATEGORIES to see transition from MENU to CATEGORIES or close
  await send(20, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.header__list > li:nth-child(5) button');
        if (btn) btn.click();
      })()
    `
  });

  for (let delay of [100, 300, 600, 900, 1400]) {
    await new Promise(r => setTimeout(r, 200));
    let s = await send(30 + delay, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/live_cat_open_${delay}ms.png`, Buffer.from(s.data, 'base64'));
    console.log(`Saved live_cat_open_${delay}ms.png`);
  }

  // Close categories
  await send(40, 'Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.header__list > li:nth-child(5) button');
        if (btn) btn.click();
      })()
    `
  });

  for (let delay of [100, 300, 600, 900]) {
    await new Promise(r => setTimeout(r, 200));
    let s = await send(50 + delay, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/live_cat_close_${delay}ms.png`, Buffer.from(s.data, 'base64'));
    console.log(`Saved live_cat_close_${delay}ms.png`);
  }

  ws.close();
  chrome.kill();
}

inspectLiveSerotoninn();
