const fs = require('fs');

const html = fs.readFileSync('C:/Users/ifas0/.gemini/antigravity-cli/brain/42e0257d-cab2-4ee7-a8ba-fac49eb560a2/scratch/index_clean.html', 'utf8');

// Find all top-level elements inside <body>
const bodyStart = html.indexOf('<body');
const bodyContent = html.slice(bodyStart);

const elements = [];
const regex = /<(header|footer|main|section|div)\s+(?:id="[^"]*"\s+)?class="([^"]+)"[^>]*>/g;
let m;
while ((m = regex.exec(bodyContent)) !== null) {
  const tag = m[1];
  const cls = m[2];
  if (['header', 'footer', 'main', 'section'].includes(tag) || 
      cls.includes('search') || 
      cls.includes('menu') || 
      cls.includes('cart') || 
      cls.includes('sing-up') ||
      cls.includes('cursor')) {
    elements.push({ tag, cls: cls.split(' ')[0], fullCls: cls, index: m.index });
  }
}

console.log('Top-level containers in order:');
elements.forEach((el, i) => console.log(`${i}: <${el.tag} class="${el.fullCls}">`));
