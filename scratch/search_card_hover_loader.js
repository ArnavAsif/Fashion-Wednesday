const fs = require('fs');
const js = fs.readFileSync('scratch/loader.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('card-hover', pos)) !== -1) {
  console.log('--- card-hover AT POS', pos, '---');
  console.log(js.slice(Math.max(0, pos - 150), Math.min(js.length, pos + 400)));
  pos += 10;
}
