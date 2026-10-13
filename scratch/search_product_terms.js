const fs = require('fs');
const css = fs.readFileSync('out/_next/static/css/fea80fa1b6b77e53.css', 'utf8');

['guide', 'care', 'color', 'size', 'bag', 'left', 'grey', 'cart'].forEach(w => {
  let count = 0;
  let idx = 0;
  while ((idx = css.indexOf(w, idx)) !== -1 && count < 3) {
    const start = Math.max(0, idx - 40);
    const end = Math.min(css.length, idx + 80);
    console.log(`[${w} @ ${idx}]: ` + css.substring(start, end).replace(/\n/g, ' '));
    idx += w.length;
    count++;
  }
});
