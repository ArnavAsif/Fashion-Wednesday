const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');
const regex = /[^{}]*hover-lottie[^{}]*\{[^}]*\}/g;
const m = html.match(regex);
console.log('Matches:', m);

const r2 = /[^{}]*char-clone[^{}]*\{[^}]*\}/g;
console.log('Char clone matches:', html.match(r2));

const r3 = /[^{}]*hover-link[^{}]*\{[^}]*\}/g;
console.log('Hover link matches:', html.match(r3));
