const fs = require('fs');
const cat = fs.readFileSync('scratch/full_menu_categories.html', 'utf8');

const colStart = cat.indexOf('class="menu__collection"');
if (colStart !== -1) {
  const colChunk = cat.slice(colStart, colStart + 3000);
  console.log('Collection chunk:\n', colChunk.slice(0, 1500));
}
