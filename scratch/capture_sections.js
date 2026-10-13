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
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const json = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9223/json', (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
  });

  const page = json.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  await new Promise(r => ws.onopen = r);
  console.log('Connected to CDP');

  let reqId = 1;

  async function evalJs(expr) {
    return send(ws, reqId++, 'Runtime.evaluate', { expression: expr, awaitPromise: true });
  }

  async function screenshot(filename) {
    const res = await send(ws, reqId++, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/projects-react/serotoninn/scratch/' + filename, Buffer.from(res.data, 'base64'));
    console.log('Saved', filename);
  }

  // Wait for initial load
  await new Promise(r => setTimeout(r, 2000));

  // 1. Arrivals
  await evalJs("document.querySelector('#arrivals')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('section_arrivals.png');

  // 2. Categories
  await evalJs("document.querySelector('#categories')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('section_categories.png');

  // 3. Best
  await evalJs("document.querySelector('#best')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('section_best.png');

  // 4. Film / Motion
  await evalJs("document.querySelector('#film')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1200));
  await screenshot('section_motion.png');

  // 5. Footer
  await evalJs("document.querySelector('#footer')?.scrollIntoView({ behavior: 'instant' });");
  await new Promise(r => setTimeout(r, 1500));
  await screenshot('section_footer.png');

  ws.close();
  chrome.kill();
  console.log('Finished all screenshots');
}

run().catch(console.error);
