const fs = require('fs');
let html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');
html = html.replace(/src="data:[^"]+"/g, 'data:...').replace(/srcset="data:[^"]+"/g, 'data:...').replace(/srcSet="data:[^"]+"/g, 'data:...');

const idx = html.indexOf('class="best-section__bottom');
if (idx !== -1) {
  console.log(html.substring(idx, idx + 2000));
}
