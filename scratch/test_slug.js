const fs = require('fs');
const content = fs.readFileSync('lib/products.ts', 'utf8');

// Parse products JSON or regex
const hrefMatches = content.match(/"href":\s*"([^"]+)"/g) || [];
console.log('Total hrefs in products.ts:', hrefMatches.length);

const slugs = new Set();
let duplicates = 0;
for (const h of hrefMatches) {
  const url = h.split('"')[3];
  const m = url.match(/\/products\/([^\/]+)\/?/);
  const slug = m ? m[1] : null;
  if (slug) {
    if (slugs.has(slug)) duplicates++;
    slugs.add(slug);
  }
}
console.log('Unique slugs found:', slugs.size, 'Duplicates:', duplicates);
console.log('First 5 slugs:', Array.from(slugs).slice(0, 5));
