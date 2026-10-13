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

async function runMobile() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--window-size=390,844',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const json = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9225/json', (res) => {
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

  // 1. Mobile Hero
  await screenshot('mobile_hero.png');

  // 2. Mobile Arrivals
  await evalJs("document.querySelector('#arrivals')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('mobile_arrivals.png');

  // 3. Mobile Categories
  await evalJs("document.querySelector('#categories')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('mobile_categories.png');

  // 4. Mobile Footer
  await evalJs("document.querySelector('#footer')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('mobile_footer.png');

  ws.close();
  chrome.kill();
}

runMobile().catch(console.error);
