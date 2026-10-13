const fs = require('fs');
let html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const idx = html.indexOf('class="arrivals-card');
if (idx !== -1) {
  let sub = html.substring(idx, idx + 2500);
  sub = sub.replace(/src="data:[^"]+"/g, 'data:...').replace(/srcset="data:[^"]+"/g, 'data:...');
  console.log(sub);
}
