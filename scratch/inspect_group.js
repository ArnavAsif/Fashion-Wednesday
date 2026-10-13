const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');

const groupIdx = html.indexOf('arrivals-section__group');
console.log('arrivals-section__group:');
console.log(html.slice(groupIdx - 100, groupIdx + 2000));
