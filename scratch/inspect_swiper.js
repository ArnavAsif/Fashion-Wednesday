const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');

const target = html.indexOf('arrivals-section__group-swiper');
console.log('arrivals-section__group-swiper position:', target);
if (target !== -1) {
  console.log(html.slice(target - 50, target + 3000));
}
