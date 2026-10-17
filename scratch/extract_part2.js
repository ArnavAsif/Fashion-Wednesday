const fs = require('fs');
const html = fs.readFileSync('scratch/serotoninn_index.html', 'utf8');

const menuStart = html.indexOf('class="menu menu--menu"');
if (menuStart !== -1) {
  const menuChunk = html.slice(menuStart + 2500, menuStart + 6000);
  fs.writeFileSync('scratch/menu_menu_snippet_part2.html', menuChunk);
  console.log('Saved menu--menu snippet part 2');
}
