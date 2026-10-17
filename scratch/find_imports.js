const fs = require('fs');
const js = fs.readFileSync('scratch/serotoninn_main.js', 'utf8');

const imports = [...js.matchAll(/from\s*["'](\.[^"']+)["']/g)].map(m => m[1]);
console.log('Imported modules:', imports);

// Also look at what keywords exist in main.js
const terms = ['header', 'menu', 'categories', 'overlay', 'nav', 'open', 'close', 'anim'];
for (const term of terms) {
  const matches = [...js.matchAll(new RegExp(`.{0,40}${term}.{0,60}`, 'gi'))];
  console.log(`Term "${term}": ${matches.length} matches`);
}
