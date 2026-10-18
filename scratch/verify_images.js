const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// 1. Check all images in lib/products.ts
const content = fs.readFileSync(path.join(root, 'lib', 'products.ts'), 'utf8');
const jsonMatch = content.match(/export const PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\n\nexport function/);
const products = JSON.parse(jsonMatch[1]);

let missingProductsImages = 0;
for (const p of products) {
  for (const row of p.images) {
    for (const imgPath of row) {
      const fullPath = path.join(root, 'public', imgPath.replace(/^\//, ''));
      if (!fs.existsSync(fullPath)) {
        console.error('Missing in products.ts:', imgPath, 'for product', p.id);
        missingProductsImages++;
      }
    }
  }
}

// 2. Check MenuModal images
const menuModal = fs.readFileSync(path.join(root, 'components', 'MenuModal.tsx'), 'utf8');
const menuMatches = menuModal.match(/\/images\/products\/[^\s'"]+/g) || [];
let missingMenuImages = 0;
for (const m of menuMatches) {
  const fullPath = path.join(root, 'public', m.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.error('Missing in MenuModal.tsx:', m);
    missingMenuImages++;
  }
}

// 3. Check ArrivalsSection images
const arrivals = fs.readFileSync(path.join(root, 'components', 'ArrivalsSection.tsx'), 'utf8');
const arrivalsMatches = arrivals.match(/\/images\/products\/[^\s'"]+/g) || [];
let missingArrivalsImages = 0;
for (const m of arrivalsMatches) {
  const fullPath = path.join(root, 'public', m.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.error('Missing in ArrivalsSection.tsx:', m);
    missingArrivalsImages++;
  }
}

console.log('Results:');
console.log('  Total products in products.ts:', products.length);
console.log('  products.ts missing images:', missingProductsImages);
console.log('  MenuModal.tsx checked images:', menuMatches.length, 'missing:', missingMenuImages);
console.log('  ArrivalsSection.tsx checked images:', arrivalsMatches.length, 'missing:', missingArrivalsImages);
