const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9296',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9296/json', r => {
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

  await send(1, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Force page reload so it picks up the latest CSS
  await send(2, 'Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2000));

  const info = await send(3, 'Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector(".arrivals-section__group");
        const swiper = document.querySelector(".arrivals-section__swiper-mob");
        return {
          groupDisplay: el ? getComputedStyle(el).display : 'null',
          swiperDisplay: swiper ? getComputedStyle(swiper).display : 'null',
          swiperSlides: swiper ? swiper.querySelectorAll('.swiper-slide').length : 0,
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Info after reload:', info.result.value);

  ws.close();
  chrome.kill();
}
test();
