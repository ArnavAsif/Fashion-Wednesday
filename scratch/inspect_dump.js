const fs = require('fs');
const path = require('path');
const base = 'C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn';

// Find all js files in the dump
function findFiles(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) res.push(...findFiles(full));
    else if (f.endsWith('.js')) res.push(full);
  }
  return res;
}

const jsFiles = findFiles(base);
console.log('JS files found:', jsFiles);

for (const file of jsFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('motion-section') || content.includes('FOOTER_LOTTIE') || content.includes('footer__discount')) {
    console.log('\nRelevant file:', file);
    // Let's search for snippets
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('motion-section') || l.includes('FOOTER_LOTTIE') || l.includes('footer__discount') || l.includes('Discount') || l.includes('discount')) {
        console.log(`Line ${idx + 1}: ${l.substring(0, 200)}`);
      }
    });
  }
}
