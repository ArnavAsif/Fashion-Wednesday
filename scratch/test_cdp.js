const http = require('http');
const { spawn } = require('child_process');

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  // wait 2s for chrome to start
  await new Promise(r => setTimeout(r, 2500));

  // Get debug targets
  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', async () => {
      const targets = JSON.parse(data);
      console.log('Targets:', targets.length);
      const wsUrl = targets[0]?.webSocketDebuggerUrl;
      console.log('Debugger URL:', wsUrl);
      chrome.kill();
    });
  });
}

capture();
