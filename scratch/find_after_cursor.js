const fs = require('fs');
let html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const idx = html.indexOf('arrivals-section__cursor cursor');
if (idx !== -1) {
  let sub = html.substring(idx + 500, idx + 4500);
  sub = sub.replace(/src="data:[^"]+"/g, 'data:...').replace(/srcset="data:[^"]+"/g, 'data:...');
  console.log(sub.slice(0, 3000));
}
