const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9295',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const json = await new Promise(res => http.get('http://127.0.0.1:9295/json', r => {
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

  const initialWidth = await send(1, 'Runtime.evaluate', { expression: 'window.innerWidth', returnByValue: true });
  console.log('Initial innerWidth:', initialWidth.result.value);

  await send(2, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  const afterWidth = await send(3, 'Runtime.evaluate', { expression: 'window.innerWidth', returnByValue: true });
  console.log('After override innerWidth:', afterWidth.result.value);

  // Check computed display of swiper and desktop group
  const swiperDisplay = await send(4, 'Runtime.evaluate', {
    expression: 'document.querySelector(".arrivals-section__swiper-mob") ? getComputedStyle(document.querySelector(".arrivals-section__swiper-mob")).display : "not found"',
    returnByValue: true
  });
  const groupDisplay = await send(5, 'Runtime.evaluate', {
    expression: 'document.querySelector(".arrivals-section__group") ? getComputedStyle(document.querySelector(".arrivals-section__group")).display : "not found"',
    returnByValue: true
  });
  console.log('Swiper display:', swiperDisplay.result.value);
  console.log('Group display:', groupDisplay.result.value);

  ws.close();
  chrome.kill();
}
test();
