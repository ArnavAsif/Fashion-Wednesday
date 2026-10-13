const fs = require('fs');
const content = fs.readFileSync('lib/products.ts', 'utf8');

const arrivals = [
  'sunna-dress',
  'witch-velvet-corset',
  'velvet-bra-top',
  'mesh-dress',
  'sparkling-mini-dress',
  'classic-knit-maxi-dress'
];

arrivals.forEach(slug => {
  const has = content.includes(slug);
  console.log(`Slug ${slug} in lib/products.ts:`, has);
});
