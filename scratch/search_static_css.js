const fs = require('fs');
const css = fs.readFileSync('out/_next/static/css/fea80fa1b6b77e53.css', 'utf8');
console.log('Length:', css.length);
['hover-lottie', 'hover-link', 'char-clone', 'arrivals-section__button', 'product-page', 'details'].forEach(term => {
  let idx = 0;
  while ((idx = css.indexOf(term, idx)) !== -1) {
    const start = Math.max(0, idx - 100);
    const end = Math.min(css.length, idx + 200);
    console.log(`=== Found ${term} at ${idx} ===`);
    console.log(css.substring(start, end));
    idx += term.length;
    break;
  }
});
