const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

const files = [
  'campaign_model.mp4',
  'video_2.mp4',
  'best_video_1.mp4',
  'best_video_2.mp4'
];

for (const file of files) {
  const input = path.join(__dirname, '..', 'public', 'videos', file);
  const temp = path.join(__dirname, '..', 'public', 'videos', 'temp_' + file);
  if (!fs.existsSync(input)) {
    console.log('Skipping ' + file + ' (not found)');
    continue;
  }
  console.log('Optimizing ' + file + '...');
  execSync(`"${ffmpeg}" -y -i "${input}" -c:v libx264 -crf 24 -preset fast -an -movflags +faststart "${temp}"`, { stdio: 'inherit' });
  const oldSize = fs.statSync(input).size;
  const newSize = fs.statSync(temp).size;
  console.log(`${file}: ${(oldSize/1024/1024).toFixed(2)}MB -> ${(newSize/1024/1024).toFixed(2)}MB (${((1 - newSize/oldSize)*100).toFixed(1)}% reduction)`);
  fs.renameSync(temp, input);
}
console.log('All hero & page videos optimized!');
