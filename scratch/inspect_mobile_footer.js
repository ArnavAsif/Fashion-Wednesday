const http = require('http');
const { spawn } = require('child_process');

function send(ws, id, method, params = {}) {
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

async function inspectFooter() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9226/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const res = await send(ws, 1, 'Runtime.evaluate', {
    expression: `(() => {
      function getR(el) {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { top: Math.round(b.top), left: Math.round(b.left), width: Math.round(b.width), height: Math.round(b.height) };
      }
      const footer = document.querySelector('.footer');
      if (footer) footer.scrollIntoView({ behavior: 'instant' });
      const top = document.querySelector('.footer__top');
      const navs = Array.from(document.querySelectorAll('.footer__nav'));
      const discount = document.querySelector('.footer__discount');
      return {
        footerRect: getR(footer),
        topRect: getR(top),
        discountRect: getR(discount),
        nav0Items: navs[0] ? Array.from(navs[0].children).map(c => ({ text: c.textContent.trim(), rect: getR(c) })) : [],
        nav1Items: navs[1] ? Array.from(navs[1].children).map(c => ({ text: c.textContent.trim(), rect: getR(c) })) : []
      };
    })()`,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
  chrome.kill();
}
inspectFooter().catch(console.error);
