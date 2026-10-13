const http = require('http');
const { spawn } = require('child_process');

async function testClick() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9325',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9325/json', r => {
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

  // Click the discount button
  const res = await send(1, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.footer__discount-btn');
      if (btn) btn.click();
      return { clicked: !!btn };
    })()`,
    returnByValue: true
  });
  console.log('Click result:', res.value);
  await new Promise(r => setTimeout(r, 600));

  // Check if newsletter modal opened
  const modalRes = await send(2, 'Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('.newsletter') || document.querySelector('[class*="newsletter"]');
      return {
        hasModal: !!modal,
        display: modal ? window.getComputedStyle(modal).display : null,
        opacity: modal ? window.getComputedStyle(modal).opacity : null,
        visibility: modal ? window.getComputedStyle(modal).visibility : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Newsletter modal status:', modalRes.value);

  ws.close();
  chrome.kill();
}
testClick();
