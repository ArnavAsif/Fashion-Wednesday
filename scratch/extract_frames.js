const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const videoFile = 'C:\\Users\\ifas0\\Downloads\\Recording 2026-10-17 133111.mp4';
const outputDir = path.join('scratch', 'recording_frames');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let doneCount = 0;
const times = [2, 4, 6, 8, 10, 12, 14];

const server = http.createServer((req, res) => {
  if (req.url === '/video.mp4') {
    const stat = fs.statSync(videoFile);
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(videoFile, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(videoFile).pipe(res);
    }
    return;
  }

  if (req.method === 'POST' && req.url.startsWith('/save')) {
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(body);
      const url = new URL(req.url, 'http://localhost:8999');
      const filename = url.searchParams.get('name') || 'frame.jpg';
      fs.writeFileSync(path.join(outputDir, filename), buffer);
      console.log('Saved:', filename);
      doneCount++;
      if (doneCount >= times.length) {
        console.log('Done all frames!');
        setTimeout(() => process.exit(0), 1000);
      }
      res.end('ok');
    });
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <body>
      <video id="v" src="/video.mp4" muted autoplay playsinline style="display:none"></video>
      <canvas id="c" style="display:none"></canvas>
      <script>
        const v = document.getElementById('v');
        const c = document.getElementById('c');
        const times = [2, 4, 6, 8, 10, 12, 14];
        let idx = 0;

        v.onloadedmetadata = () => {
          c.width = v.videoWidth;
          c.height = v.videoHeight;
          seekNext();
        };

        function seekNext() {
          if (idx >= times.length) return;
          v.currentTime = times[idx];
        }

        v.onseeked = () => {
          const ctx = c.getContext('2d');
          ctx.drawImage(v, 0, 0, c.width, c.height);
          c.toBlob(blob => {
            fetch('/save?name=frame_' + String(times[idx]).padStart(2, '0') + 's.jpg', {
              method: 'POST',
              body: blob
            }).then(() => {
              idx++;
              seekNext();
            });
          }, 'image/jpeg', 0.85);
        };
      </script>
    </body>
    </html>
  `);
});

server.listen(8999, () => {
  console.log('Server on 8999');
  exec('"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --headless --disable-gpu http://localhost:8999');
});

setTimeout(() => {
  console.log('Timeout exit');
  process.exit(0);
}, 12000);
