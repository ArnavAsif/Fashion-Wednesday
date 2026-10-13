const fs = require('fs');
const code = fs.readFileSync('scratch/main_original.js', 'utf8');
const titles = code.match(/0\d\.\s*[^<\"\'\n]+/g) || [];
console.log([...new Set(titles)]);
