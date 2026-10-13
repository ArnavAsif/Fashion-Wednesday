const fs = require('fs');
const code = fs.readFileSync('scratch/main_original.js', 'utf8');

// Find function containing hero-section
const heroIdx = code.indexOf('.hero-section');
console.log('Hero index:', heroIdx);

// Look backwards for function keyword or arrow
let funcStart = code.lastIndexOf('function', heroIdx);
console.log('Hero func start:', funcStart);
// Let's print 3000 chars around it
console.log('=== HERO CODE ===');
console.log(code.substring(funcStart - 200, funcStart + 4000));

// Find function containing categories-section
const catIdx = code.indexOf('.categories-section');
console.log('\n=== CATEGORIES CODE ===');
let catFuncStart = code.lastIndexOf('function', catIdx);
console.log(code.substring(catFuncStart - 100, catFuncStart + 4000));

// Also let's check Fe() and Ve()
console.log('\n=== Fe / Ve functions ===');
const feIdx = code.indexOf('function Fe(');
if (feIdx !== -1) {
  console.log(code.substring(feIdx, feIdx + 3000));
}
