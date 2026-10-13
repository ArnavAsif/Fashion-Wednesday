const fs = require('fs');
let html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

// Replace all data URIs
html = html.replace(/src="data:[^"]+"/g, 'src="[DATA_URI]"');

const idx = html.indexOf('class="menu__popup"');
if (idx !== -1) {
  console.log(html.substring(idx, idx + 4000));
}
