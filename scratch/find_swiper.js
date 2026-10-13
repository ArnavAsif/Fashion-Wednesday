const fs = require('fs');
let html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const idx = html.indexOf('arrivals-section__group-swiper');
if (idx !== -1) {
  let sub = html.substring(idx - 100, idx + 1000);
  console.log(sub.replace(/src="data:[^"]+"/g, 'data:...'));
} else {
  console.log('not found arrivals-section__group-swiper');
}
