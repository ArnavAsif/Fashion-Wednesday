const fs = require('fs');
const js = fs.readFileSync('scratch/main.js', 'utf8');

console.log('--- ARRIVALS SEARCH IN MAIN.JS ---');
const lines = js.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('arrivals') || l.includes('card-hover') || l.includes('group-swiper')) {
    console.log(`Line ${idx + 1}: ${l.slice(0, 200)}`);
  }
});
