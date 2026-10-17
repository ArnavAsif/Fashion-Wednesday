const fs = require('fs');
const html = fs.readFileSync('scratch/serotoninn_index.html', 'utf8');

// Find menu--menu HTML
const menuStart = html.indexOf('class="menu menu--menu"');
if (menuStart !== -1) {
  const menuChunk = html.slice(menuStart - 20, menuStart + 3500);
  fs.writeFileSync('scratch/menu_menu_snippet.html', menuChunk);
  console.log('Saved menu--menu snippet');
}

// Find menu--categories HTML
const catStart = html.indexOf('class="menu menu--categories"');
if (catStart !== -1) {
  const catChunk = html.slice(catStart - 20, catStart + 3500);
  fs.writeFileSync('scratch/menu_categories_snippet.html', catChunk);
  console.log('Saved menu--categories snippet');
}
