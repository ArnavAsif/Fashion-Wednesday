const fs = require('fs');
const css = fs.readFileSync('app/globals.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('hover-lottie') || l.includes('hover-link') || l.includes('char-clone') || l.includes('arrivals-section__button')) {
    console.log(`Line ${idx+1}: ${l.substring(0, 100)}`);
  }
});
