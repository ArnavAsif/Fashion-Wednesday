const http = require('http');
const { spawn } = require('child_process');

async function check() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9263',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9263/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  await new Promise(r => setTimeout(r, 1500));

  const res = await new Promise((resolve) => {
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 1) resolve(data.result);
    };
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const el = document.getElementById('film');
          el.scrollIntoView({ behavior: 'instant' });
          const textGroup = document.querySelector('#film .container');
          const sub = document.querySelector('.motion-section__subtitle');
          const txt = document.querySelector('.motion-section__text');
          const pin = document.querySelector('.motion-section__pin');
          return {
            scrollY: window.scrollY,
            filmRect: el.getBoundingClientRect(),
            pinRect: pin ? pin.getBoundingClientRect() : null,
            textGroupStyle: textGroup ? textGroup.getAttribute('style') : null,
            subStyle: sub ? sub.getAttribute('style') : null,
            txtStyle: txt ? txt.getAttribute('style') : null,
            subComputed: sub ? { opacity: getComputedStyle(sub).opacity, transform: getComputedStyle(sub).transform } : null,
            txtComputed: txt ? { opacity: getComputedStyle(txt).opacity, transform: getComputedStyle(txt).transform } : null,
            textGroupComputed: textGroup ? { opacity: getComputedStyle(textGroup).opacity, transform: getComputedStyle(textGroup).transform, top: textGroup.getBoundingClientRect().top } : null
          };
        })()`,
        returnByValue: true
      }
    }));
  });
  console.log(JSON.stringify(res.result ? res.result.value : res, null, 2));
  ws.close();
  chrome.kill();
}
check().catch(console.error);
