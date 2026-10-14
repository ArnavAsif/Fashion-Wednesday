const fs = require('fs');
const js = fs.readFileSync('scratch/main.js', 'utf8');

const regexes = [/best-section/g, /best-card/g, /best_mask/g];
regexes.forEach(r => {
  let m;
  while ((m = r.exec(js)) !== null) {
    console.log('Match for', r, 'at', m.index);
    console.log(js.substring(Math.max(0, m.index - 100), Math.min(js.length, m.index + 200)));
    console.log('---');
  }
});
