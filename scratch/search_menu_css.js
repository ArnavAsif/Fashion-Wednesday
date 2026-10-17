const fs = require('fs');
const css = fs.readFileSync('scratch/serotoninn_main.css', 'utf8');

const menuRules = css.match(/[^{}]*\.menu[^{]*\{[^}]*\}/g) || [];
console.log('CSS rules for .menu (first 15):');
menuRules.slice(0, 15).forEach(r => console.log(r.replace(/\s+/g, ' ')));

console.log('Total .menu rules in CSS:', menuRules.length);

const js = fs.readFileSync('scratch/serotoninn_main.js', 'utf8');
const menuMatchesInJs = js.match(/.{0,50}(?:menu--|menu__|openMenu|closeMenu).{0,50}/g) || [];
console.log('JS matches for menu (first 10):');
menuMatchesInJs.slice(0, 10).forEach(m => console.log(m.replace(/\s+/g, ' ')));
