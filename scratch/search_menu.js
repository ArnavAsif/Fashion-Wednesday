const fs = require('fs');

const js = fs.readFileSync('scratch/serotoninn_main.js', 'utf8');
const css = fs.readFileSync('scratch/serotoninn_main.css', 'utf8');

console.log('--- Search in main.js for menu / categories / animation ---');
const jsLines = js.split('\n');
jsLines.forEach((line, i) => {
  if (line.match(/menu/i) || line.match(/categories/i) || line.match(/modal/i) || line.match(/gsap/i) || line.match(/timeline/i)) {
    console.log(`JS L${i+1}: ${line.trim().slice(0, 140)}`);
  }
});
