const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');
const m = html.match(/href="([^"]+\.css[^"]*)"/g);
console.log(m);
