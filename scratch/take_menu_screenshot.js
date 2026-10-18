const { exec } = require('child_process');
const http = require('http');

// Use Edge remote debugging or simple screenshot
const cmd = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --headless --disable-gpu --window-size=1920,1080 --screenshot="C:\\projects-react\\serotoninn\\scratch\\page_screenshot.png" http://localhost:3000';

exec(cmd, (err, stdout, stderr) => {
  console.log('Screenshot taken!');
});
