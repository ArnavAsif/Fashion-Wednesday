const fs = require('fs');
const js = fs.readFileSync('scratch/main.js', 'utf8');

console.log(js.slice(17500, 22000));
