const fs = require('fs');
const css = fs.readFileSync('out/_next/static/css/fea80fa1b6b77e53.css', 'utf8');

let idx = 0;
while ((idx = css.indexOf('product', idx)) !== -1) {
  const start = Math.max(0, idx - 80);
  const end = Math.min(css.length, idx + 120);
  console.log(`[${idx}]: ` + css.substring(start, end).replace(/\n/g, ' '));
  idx += 7;
}
