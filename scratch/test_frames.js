const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

async function testFrames() {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <style>
    body { background: #333; margin: 0; padding: 20px; }
    #container { width: 347px; height: 176px; position: relative; }
  </style>
</head>
<body>
  <div id="container"></div>
  <script>
    window.anim = lottie.loadAnimation({
      container: document.getElementById('container'),
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      path: '/lottie/FOOTER_LOTTIE_v1.json'
    });
  </script>
</body>
</html>
  `;
  fs.writeFileSync('public/test_lottie.html', html);
  console.log('Written test_lottie.html');
}
testFrames();
