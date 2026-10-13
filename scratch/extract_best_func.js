const fs = require('fs');
const code = fs.readFileSync('scratch/main_original.js', 'utf8');

const neStart = code.indexOf('function Ne(');
const zeStart = code.indexOf('function ze(');
const nextFunc = code.indexOf('function ', zeStart + 20);

console.log('Ne:');
console.log(code.substring(neStart, zeStart));
console.log('ze:');
console.log(code.substring(zeStart, nextFunc));
