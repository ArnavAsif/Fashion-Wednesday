const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');

const groupIdx = html.indexOf('arrivals-section__group');
const cursorEnd = html.indexOf('</svg>', groupIdx);
console.log('After cursor:');
console.log(html.slice(cursorEnd, cursorEnd + 4000));
