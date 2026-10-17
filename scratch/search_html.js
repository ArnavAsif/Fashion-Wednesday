const fs = require('fs');
const html = fs.readFileSync('scratch/serotoninn_index.html', 'utf8');

// search for categories overlay or menu structure in HTML
const matches = [...html.matchAll(/class="[^"]*(?:menu|categories|overlay|modal|drawer)[^"]*"/gi)];
console.log('Class matches:', [...new Set(matches.map(m => m[0]))]);

// search for js files in wp-content/themes/ref/js
const jsMatches = [...html.matchAll(/\/wp-content\/themes\/ref\/js\/[^"'\s]+/g)];
console.log('All theme JS files in HTML:', [...new Set(jsMatches.map(m => m[0]))]);
