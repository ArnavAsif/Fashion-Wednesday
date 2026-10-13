const fs = require('fs');
let html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const idx = html.indexOf('class="arrivals-section__group"');
if (idx !== -1) {
  let sub = html.substring(idx, idx + 8000);
  // remove all src="..."
  sub = sub.replace(/src="[^"]+"/g, '');
  sub = sub.replace(/d="[^"]+"/g, '');
  console.log(sub.slice(0, 2000));
}
