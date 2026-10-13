const fs = require('fs');
const html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const menuMatch = html.match(/<div class="[^"]*menu[^"]*"[\s\S]*?<\/div>/);
const idx = html.indexOf('class="menu');
if (idx !== -1) {
  console.log(html.substring(idx - 50, idx + 2500));
} else {
  console.log('No class="menu" found');
}
