const fs = require('fs');
const content = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = regex.exec(content)) !== null) {
  i++;
  const tag = match[0];
  const srcMatch = tag.match(/src="([^"]+)"/i);
  if (srcMatch) {
    console.log(`Script ${i} src:`, srcMatch[1]);
  } else {
    const text = match[1].trim();
    if (text.includes('arrivals') || text.includes('card-hover') || text.includes('group-swiper')) {
      console.log(`Script ${i} inline (relevant):`, text.slice(0, 500));
    }
  }
}
