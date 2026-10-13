const fs = require('fs');
const content = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/index.html', 'utf8');
const start = content.indexOf('class="arrivals-section"');
if (start !== -1) {
  const sectionStart = content.lastIndexOf('<section', start);
  const sectionEnd = content.indexOf('</section>', start) + 10;
  console.log('Section found from', sectionStart, 'to', sectionEnd);
  fs.writeFileSync('C:/projects-react/serotoninn/scratch/arrivals_original.html', content.slice(sectionStart, sectionEnd));
  console.log('Written to scratch/arrivals_original.html');
} else {
  console.log('Not found');
}
