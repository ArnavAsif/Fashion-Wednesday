const fs = require('fs');
const css = fs.readFileSync('out/_next/static/css/fea80fa1b6b77e53.css', 'utf8');

let idx = 0;
while ((idx = css.indexOf('.header', idx)) !== -1) {
  const end = css.indexOf('}', idx);
  console.log(css.substring(idx, Math.min(css.length, end + 1)));
  idx = end + 1;
}
