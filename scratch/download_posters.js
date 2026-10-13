const fs = require('fs');
const https = require('https');

const files = [
  { url: 'https://serotoninn.com/wp-content/themes/ref/img/best_img_1.webp', dest: 'C:/projects-react/serotoninn/public/images/best_img_1.webp' },
  { url: 'https://serotoninn.com/wp-content/uploads/2026/01/best_img_2.webp', dest: 'C:/projects-react/serotoninn/public/images/best_img_2.webp' },
  { url: 'https://serotoninn.com/wp-content/uploads/2026/01/motion_poster.webp', dest: 'C:/projects-react/serotoninn/public/images/motion_poster.webp' },
];

files.forEach(({ url, dest }) => {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => console.log('Downloaded', dest, fs.statSync(dest).size));
    } else {
      console.log('Failed', url, res.statusCode);
    }
  }).on('error', err => console.log('Error', url, err.message));
});
