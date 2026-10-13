const fs = require('fs');
let html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const idx = html.indexOf('class="best-section__top"');
if (idx !== -1) {
  console.log(html.substring(idx - 100, idx + 500));
}
