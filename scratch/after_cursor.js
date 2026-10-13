const fs = require('fs');
let html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const idx = html.indexOf('arrivals-section__cursor');
const closeCursor = html.indexOf('</div>', idx);
console.log('After cursor div:');
console.log(html.substring(closeCursor + 6, closeCursor + 2000).replace(/src="data:[^"]+"/g, 'data:...'));
