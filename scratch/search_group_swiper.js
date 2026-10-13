const fs = require('fs');
const js = fs.readFileSync('scratch/main.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('group-swiper', pos)) !== -1) {
  console.log('--- group-swiper AT POS', pos, '---');
  console.log(js.slice(Math.max(0, pos - 200), Math.min(js.length, pos + 400)));
  pos += 12;
}
