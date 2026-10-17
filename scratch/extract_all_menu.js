const fs = require('fs');
const css = fs.readFileSync('scratch/serotoninn_main.css', 'utf8');

const menuRules = css.match(/[^{}]*menu[^{]*\{[^}]*\}/g) || [];
fs.writeFileSync('scratch/all_menu_rules.css', menuRules.map(r => r.replace(/\s+/g, ' ')).join('\n'));
console.log('Saved all_menu_rules.css, count:', menuRules.length);

// Also check canvas or SVG or pseudo-elements in .menu or loader
const canvasMatches = css.match(/[^{}]*(?:canvas|shutter|curtain|clip-path|transform|transition|scale|grid)[^{]*\{[^}]*\}/g) || [];
console.log('Total rules with transform/transition/canvas etc:', canvasMatches.length);
