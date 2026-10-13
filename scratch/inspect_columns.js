const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_clean.html', 'utf8');

const regex = /<ul class="arrivals-section__group-swiper ([^"]+)">([\s\S]*?)<\/ul>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  const colName = m[1];
  const items = m[2].match(/<li\b[^>]*>[\s\S]*?<\/li>/gi) || [];
  console.log(`Column ${colName} has ${items.length} items`);
  items.slice(0, 3).forEach((item, idx) => {
    const title = item.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const cls = item.match(/class="([^"]*)"/i);
    console.log(`  [${idx}] class="${cls ? cls[1] : ''}" title: ${title ? title[1].trim() : 'no title'}`);
  });
}
