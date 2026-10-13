const fs = require('fs');
const js = fs.readFileSync('scratch/main.js', 'utf8');

console.log(js.slice(21000, 26900));
