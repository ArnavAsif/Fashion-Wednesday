const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');

// Find all unique products in one of the group-swiper columns
const regex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
const col1 = html.match(/<ul class="arrivals-section__group-swiper one">([\s\S]*?)<\/ul>/i);
if (col1) {
  let m;
  let idx = 0;
  while ((m = regex.exec(col1[1])) !== null) {
    idx++;
    const card = m[1];
    const title = card.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const price = card.match(/<p class="arrivals-card__price[^"]*">([\s\S]*?)<\/p>/i);
    const sizes = Array.from(card.matchAll(/<li>\s*<strong>\(<\/strong>([A-Za-z0-9\s]+)<strong>\)<\/strong>\s*<\/li>/gi)).map(s => s[1].trim());
    const best = card.includes('arrivals-card__best');
    const imgs = card.match(/<img[^>]+>/g) || [];
    console.log(`Product ${idx}:`, title ? title[1].trim() : 'no title', '| price:', price ? price[1].trim() : '', '| sizes:', sizes, '| best:', best, '| imgs count:', imgs.length);
  }
}
