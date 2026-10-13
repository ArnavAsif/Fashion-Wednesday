const fs = require('fs');
const https = require('https');

const file = fs.createWriteStream('C:/projects-react/serotoninn/public/videos/campaign_video.webm');
https.get('https://serotoninn.com/wp-content/themes/ref/media/campaign_video.webm', (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('campaign_video.webm downloaded successfully, size:', fs.statSync('C:/projects-react/serotoninn/public/videos/campaign_video.webm').size);
  });
}).on('error', (err) => {
  fs.unlink('C:/projects-react/serotoninn/public/videos/campaign_video.webm', () => {});
  console.error('Error downloading:', err.message);
});
