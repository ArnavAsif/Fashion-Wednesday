const fs = require('fs');
const js = fs.readFileSync('scratch/main.js', 'utf8');

const regex = /import[^;]+;/g;
let m;
while ((m = regex.exec(js)) !== null) {
  console.log(m[0]);
}

// Find occurrences of arrivals
let pos = 0;
while ((pos = js.indexOf('arrivals', pos)) !== -1) {
  console.log('--- ARRIVALS AT POS', pos, '---');
  console.log(js.slice(Math.max(0, pos - 150), Math.min(js.length, pos + 250)));
  pos += 8;
}
