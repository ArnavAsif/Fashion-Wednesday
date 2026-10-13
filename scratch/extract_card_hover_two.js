const fs = require('fs');
const js = fs.readFileSync('scratch/loader.js', 'utf8');

const pos = js.indexOf('function cardHoverTwo');
console.log(js.slice(pos, pos + 2500));
