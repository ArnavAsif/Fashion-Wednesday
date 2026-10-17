const fs = require('fs');
const js = fs.readFileSync('scratch/loader.js', 'utf8');

// Find the index around ".menu__popup" or ".menu__collection"
const idx = js.indexOf('.menu__popup');
console.log('Index:', idx);

// Let's grab 10,000 characters before and after idx
const start = Math.max(0, idx - 4000);
const end = Math.min(js.length, idx + 10000);
const chunk = js.slice(start, end);

fs.writeFileSync('scratch/menu_extracted.js', chunk);
console.log('Extracted chunk around menu logic, length:', chunk.length);
