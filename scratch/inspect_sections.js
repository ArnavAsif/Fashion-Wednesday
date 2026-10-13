const fs = require('fs');

const code = fs.readFileSync('scratch/main_original.js', 'utf8');

// Find snippets mentioning hero
console.log('--- HERO MATCHES ---');
let pos = 0;
while ((pos = code.indexOf('hero', pos)) !== -1) {
  console.log(code.substring(Math.max(0, pos - 80), Math.min(code.length, pos + 120)));
  console.log('---');
  pos += 10;
}

console.log('--- CATEGORIES MATCHES ---');
pos = 0;
while ((pos = code.indexOf('categories', pos)) !== -1) {
  console.log(code.substring(Math.max(0, pos - 80), Math.min(code.length, pos + 120)));
  console.log('---');
  pos += 15;
}
