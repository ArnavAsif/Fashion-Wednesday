const fs = require('fs');
const code = fs.readFileSync('scratch/main_original.js', 'utf8');

const veIdx = code.indexOf('function Ve(');
const feIdx = code.indexOf('function Fe(');
const nextFunc = code.indexOf('function $e(');

console.log('Ve start:', veIdx, 'Fe start:', feIdx, 'BoldSection start:', nextFunc);
fs.writeFileSync('scratch/cat_original_func.js', code.substring(veIdx, nextFunc));
console.log('Saved to scratch/cat_original_func.js, length:', nextFunc - veIdx);
