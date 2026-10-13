const fs = require('fs');
const html = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');

const idx = html.indexOf('COATS-mp4');
if (idx !== -1) {
  // Let's find the parent tags
  console.log('Context of COATS-mp4:');
  console.log(html.substring(idx - 600, idx + 400).replace(/src="data:[^"]+"/g, 'data:...'));
}
