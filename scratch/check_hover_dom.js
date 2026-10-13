const http = require('http');
const { spawn } = require('child_process');

async function check() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9315',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9315/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  await new Promise(r => setTimeout(r, 1000));

  const info = await new Promise((resolve) => {
    ws.onmessage = (msg) => resolve(JSON.parse(msg.data).result.value);
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const d = document.querySelector('.footer__discount');
          const btn = document.querySelector('.footer__discount-btn');
          const rev = document.querySelector('.footer__discount-reveal');
          const csD = d ? window.getComputedStyle(d) : null;
          const csBtn = btn ? window.getComputedStyle(btn) : null;
          const csRev = rev ? window.getComputedStyle(rev) : null;
          return {
            dOverflow: csD ? csD.overflow : null,
            dWidth: csD ? csD.width : null,
            dHeight: csD ? csD.height : null,
            btnPosition: csBtn ? csBtn.position : null,
            btnWidth: csBtn ? csBtn.width : null,
            btnHeight: csBtn ? csBtn.height : null,
            btnLeft: csBtn ? csBtn.left : null,
            btnTop: csBtn ? csBtn.top : null,
            revMaxWidth: csRev ? csRev.maxWidth : null,
            revOpacity: csRev ? csRev.opacity : null,
            revDisplay: csRev ? csRev.display : null,
            revText: rev ? rev.innerText : null
          };
        })()`,
        returnByValue: true
      }
    }));
  });
  console.log('Computed styles before hover:', info);

  // Now manually add .is-hovered class
  const hoveredInfo = await new Promise((resolve) => {
    ws.onmessage = (msg) => resolve(JSON.parse(msg.data).result.value);
    ws.send(JSON.stringify({
      id: 2,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const btn = document.querySelector('.footer__discount-btn');
          if (btn) btn.classList.add('is-hovered');
          const rev = document.querySelector('.footer__discount-reveal');
          const csRev = rev ? window.getComputedStyle(rev) : null;
          return {
            classes: btn ? btn.className : null,
            revMaxWidth: csRev ? csRev.maxWidth : null,
            revOpacity: csRev ? csRev.opacity : null,
            revDisplay: csRev ? csRev.display : null,
            revOffsetWidth: rev ? rev.offsetWidth : null,
            revText: rev ? rev.innerText : null
          };
        })()`,
        returnByValue: true
      }
    }));
  });
  console.log('Computed styles with .is-hovered:', hoveredInfo);

  ws.close();
  chrome.kill();
}
check();
