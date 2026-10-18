const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testProducts() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9455',
    '--window-size=1440,900',
    '--disable-gpu',
    'http://localhost:3000/products'
  ]);

  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9455/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const target = json.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((res, rej) => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener('message', handler);
        if (data.error) rej(data.error); else res(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => setTimeout(r, 2000));
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_catalog_updated.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/verify_catalog_updated.png');

  // Test a product detail page
  await send('Page.navigate', { url: 'http://localhost:3000/products/error-404-streetwear-zip-hoodie' });
  await new Promise(r => setTimeout(r, 2000));
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/verify_product_detail_updated.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scratch/verify_product_detail_updated.png');

  chrome.kill();
}

testProducts();
