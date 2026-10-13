const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');

// Strip base64 image data to make it readable
const cleaned = html.replace(/src="data:image\/[^"]+"/g, 'src="..."')
                    .replace(/srcset="[^"]+"/g, 'srcset="..."');

fs.writeFileSync('scratch/arrivals_clean.html', cleaned);
console.log('Cleaned written, length:', cleaned.length);

const groupIdx = cleaned.indexOf('arrivals-section__group');
console.log(cleaned.slice(groupIdx, groupIdx + 6000));
