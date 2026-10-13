const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function testE2E() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9455',
    '--window-size=1600,1000',
    'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9455/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1000));

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

  // 1. Check current URL on home
  const r1 = await send(1, 'Runtime.evaluate', {
    expression: 'window.location.href',
    returnByValue: true
  });
  console.log('Homepage URL:', r1.result.value);

  // 2. Find and click first arrival link
  const clickRes = await send(2, 'Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/products/"]'));
      console.log('Found product links:', links.length);
      const link = links.find(a => a.href.includes('sunna-dress') || a.href.includes('classic-knit'));
      if (link) {
        link.click();
        return link.href;
      }
      return links[0] ? (links[0].click(), links[0].href) : null;
    })()`,
    returnByValue: true
  });
  console.log('Clicked link target:', clickRes.result.value);

  // Wait for navigation
  await new Promise(r => setTimeout(r, 2000));

  const r2 = await send(3, 'Runtime.evaluate', {
    expression: 'window.location.href',
    returnByValue: true
  });
  console.log('Navigated URL:', r2.result.value);

  // Screenshot navigated page
  const snap = await send(4, 'Page.captureScreenshot', {});
  fs.writeFileSync('scratch/e2e_navigated_page.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/e2e_navigated_page.png');

  chrome.kill();
  process.exit(0);
}
testE2E().catch(e => { console.error(e); process.exit(1); });
