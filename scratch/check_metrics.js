const fs = require('fs');
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

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const json = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9224/json', (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
  });

  const page = json.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let reqId = 1;

  async function evalJs(expr) {
    return send(ws, reqId++, 'Runtime.evaluate', { expression: expr, returnByValue: true });
  }

  async function screenshot(filename) {
    const res = await send(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/projects-react/serotoninn/scratch/' + filename, Buffer.from(res.data, 'base64'));
    console.log('Saved', filename);
  }

  // 1. Check layout metrics
  const metrics = await evalJs(`(() => {
    const group = document.querySelector('.arrivals-section__group');
    const track = document.querySelector('.arrivals-section__swiper-track');
    const cards = Array.from(document.querySelectorAll('.arrivals-card'));
    return {
      group: group ? { w: group.offsetWidth, left: group.getBoundingClientRect().left } : null,
      track: track ? { w: track.offsetWidth, scrollW: track.scrollWidth } : null,
      cards: cards.slice(0, 4).map(c => ({
        w: c.offsetWidth,
        h: c.offsetHeight,
        left: c.getBoundingClientRect().left
      }))
    };
  })()`);

  console.log('Metrics:', JSON.stringify(metrics.value, null, 2));

  // 2. Arrivals
  await evalJs("document.querySelector('#arrivals')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('section_arrivals_debug.png');

  // 3. Best
  await evalJs("document.querySelector('#best')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('section_best_debug.png');

  // 4. Footer
  await evalJs("document.querySelector('#footer')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('section_footer_debug.png');

  ws.close();
  chrome.kill();
}

run().catch(console.error);
