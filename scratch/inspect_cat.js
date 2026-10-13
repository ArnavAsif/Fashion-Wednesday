const fs = require('fs');
const html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const catSectionMatch = html.match(/<section[^>]*categories-section[^>]*>([\s\S]*?)<\/section>/);
if (catSectionMatch) {
  const content = catSectionMatch[1];
  console.log('Has video tag in categories-section?', content.includes('<video'));
  const vids = content.match(/<video[\s\S]*?<\/video>/g) || [];
  console.log('Video count in categories section:', vids.length);
  vids.forEach((v, i) => console.log('Video', i, v));

  // Let's also check all cards in categories:
  const cards = content.match(/<a[^>]*class="[^"]*categories-card[^"]*"[\s\S]*?<\/a>/g) || [];
  console.log('Total cards:', cards.length);
  cards.forEach((c, i) => {
    const titleMatch = c.match(/categories-card__title">([^<]+)<\/h3>/);
    const title = titleMatch ? titleMatch[1] : '';
    const hasVid = c.includes('<video');
    const hasImg = c.includes('<img');
    console.log(`Card ${i}: ${title} - Video: ${hasVid}, Img: ${hasImg}`);
  });
}
