const fs = require('fs');
const https = require('https');

const files = [
  { url: 'https://serotoninn.com/wp-content/themes/ref/img/paper_desk.webp', dest: 'C:/projects-react/serotoninn/public/images/paper_desk.webp' },
  { url: 'https://serotoninn.com/wp-content/themes/ref/img/paper_tablet.webp', dest: 'C:/projects-react/serotoninn/public/images/paper_tablet.webp' },
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
  });
});
