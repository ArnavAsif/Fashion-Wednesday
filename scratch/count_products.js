const fs = require('fs');
const html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const products = [
  'SUNNA DRESS',
  'VELVET WITCH CORSET',
  'VELVET BRA TOP',
  'MESH DRESS',
  'SPARKLING MINI DRESS'
];

products.forEach(p => {
  let count = 0;
  let pos = 0;
  while ((pos = html.indexOf(p, pos)) !== -1) {
    count++;
    pos += p.length;
  }
  console.log(`${p}: ${count} occurrences`);
});
