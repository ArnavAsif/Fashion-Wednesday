const fs = require('fs');
const code = fs.readFileSync('scratch/main_original.js', 'utf8');

// Find the hero function start and end
const heroIdx = code.indexOf('.hero-section');
const start = code.lastIndexOf('function', heroIdx);

// Look forward for next function or export
let nextFunc = code.indexOf('function ', start + 50);
console.log('Hero function length:', nextFunc - start);
fs.writeFileSync('scratch/hero_original_func.js', code.substring(start, nextFunc));
console.log('Saved to scratch/hero_original_func.js');
