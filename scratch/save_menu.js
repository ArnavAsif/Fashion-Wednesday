const fs = require('fs');
const html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const idx = html.indexOf('class="menu');
if (idx !== -1) {
  // write 10000 chars of menu to scratch/menu_sample.html
  fs.writeFileSync('C:/projects-react/serotoninn/scratch/menu_sample.html', html.substring(idx - 50, idx + 15000));
  console.log('Saved menu sample');
}
