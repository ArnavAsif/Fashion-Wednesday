const http = require('http');

http.get('http://127.0.0.1:9223/json', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', async () => {
    // If debug session ended, let's write a node script to check DOM directly
  });
});
