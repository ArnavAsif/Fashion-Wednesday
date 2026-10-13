const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = 'C:/projects-react/serotoninn/public/lottie';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = [
  'https://serotoninn.com/wp-content/themes/ref/lottie/LOTTIE_MARKER_v1.json',
  'https://serotoninn.com/wp-content/themes/ref/lottie/LOTTIE_ARROW_v2.json',
  'https://serotoninn.com/wp-content/themes/ref/lottie/LOTTIE_MARKER_turq_v2.json',
  'https://serotoninn.com/wp-content/themes/ref/lottie/FOOTER_LOTTIE_v1.json'
];

files.forEach(url => {
  const filename = path.basename(url);
  const dest = path.join(dir, filename);
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      fs.writeFileSync(dest, data);
      console.log('Saved', filename, data.length, 'bytes');
    });
  }).on('error', err => console.error(err));
});
