const fs = require('fs');
const html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');
const matches = html.match(/https:\/\/[^"']+\.json/g) || [];
console.log('Lottie files:', [...new Set(matches)]);
