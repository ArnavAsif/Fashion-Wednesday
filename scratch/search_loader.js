const fs = require('fs');
const js = fs.readFileSync('scratch/loader.js', 'utf8');

// search for occurrences of menu or menu--
const matches = [...js.matchAll(/.{0,50}(?:menu--categories|menu--menu|\.menu|openMenu|closeMenu).{0,50}/g)].map(m => m[0].trim());
console.log('Matches in loader.js:', matches.length);
matches.slice(0, 20).forEach(m => console.log(m));
