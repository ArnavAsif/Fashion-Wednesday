const fs = require('fs');
const html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');
const idx = html.indexOf('best-section');
if (idx !== -1) {
  const endIdx = html.indexOf('</section>', idx);
  console.log('=== BEST SECTION HTML ===');
  console.log(html.substring(idx - 100, endIdx + 10));
} else {
  console.log('best-section not found');
}
