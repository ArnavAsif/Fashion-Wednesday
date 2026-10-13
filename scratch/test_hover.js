const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

async function testHover() {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <style>
    body { background: #333; margin: 0; padding: 20px; }
    #container { width: 347px; height: 176px; position: relative; cursor: pointer; }
  </style>
</head>
<body>
  <div id="container"></div>
  <script>
    let anim = lottie.loadAnimation({
      container: document.getElementById('container'),
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      path: '/lottie/FOOTER_LOTTIE_v1.json'
    });
    
    anim.addEventListener('DOMLoaded', () => {
      anim.goToAndStop(58, true);
    });

    const c = document.getElementById('container');
    c.addEventListener('mouseenter', () => {
      anim.setSpeed(1.2);
      anim.playSegments([anim.currentFrame || 58, 110], true);
    });
    c.addEventListener('mouseleave', () => {
      anim.setSpeed(1.2);
      anim.playSegments([anim.currentFrame || 110, 58], true);
    });
  </script>
</body>
</html>
  `;
  fs.writeFileSync('public/test_hover.html', html);
  console.log('Written test_hover.html');
}
testHover();
