const fs = require('fs');
const html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');
const regex = /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log('Script src:', match[1]);
}
