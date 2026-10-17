const http = require('http');
const { spawn } = require('child_process');

async function testReload() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9330',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9330/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

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

  // Scroll down to 1500px
  await send(1, 'Runtime.evaluate', {
    expression: 'window.scrollTo(0, 1500); if (window.__lenis) window.__lenis.scrollTo(1500, { immediate: true });'
  });
  await new Promise(r => setTimeout(r, 500));

  let scrollYBefore = await send(2, 'Runtime.evaluate', {
    expression: 'window.scrollY',
    returnByValue: true
  }).then(r => r.result.value);
  console.log('ScrollY before reload:', scrollYBefore);

  // Reload the page
  await send(3, 'Page.reload');
  await new Promise(r => setTimeout(r, 1500));

  let scrollYAfter = await send(4, 'Runtime.evaluate', {
    expression: 'window.scrollY',
    returnByValue: true
  }).then(r => r.result.value);
  console.log('ScrollY after reload:', scrollYAfter);

  ws.close();
  chrome.kill();

  if (scrollYAfter === 0) {
    console.log('SUCCESS: Page reloaded directly at top (hero section)!');
  } else {
    console.log('FAILED: Scroll position was', scrollYAfter);
  }
}

testReload();
