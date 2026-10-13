const fs = require('fs');
const css = fs.readFileSync('out/_next/static/css/fea80fa1b6b77e53.css', 'utf8');

const targets = ['.button', '.button__lottie', '.button__block', '.arrivals-section__button', '.link'];
targets.forEach(t => {
  let idx = 0;
  let count = 0;
  while ((idx = css.indexOf(t, idx)) !== -1 && count < 5) {
    const end = css.indexOf('}', idx);
    console.log(`Rule for ${t}:`, css.substring(idx, end + 1));
    idx = end + 1;
    count++;
  }
});
