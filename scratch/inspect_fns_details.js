const fs = require('fs');

const mainJs = fs.readFileSync('C:/Users/ifas0/.gemini/antigravity-cli/brain/42e0257d-cab2-4ee7-a8ba-fac49eb560a2/scratch/theme_js/main.js', 'utf8');

const fns = ['Xe', 'Re', 'Ve', 'We', 'He', 'Be', 'Ne', 'ze', 'Fe', 'Ge', 'Ue'];

fns.forEach(fn => {
  const pattern = `function ${fn}`;
  const idx = mainJs.indexOf(pattern);
  if (idx !== -1) {
    const chunk = mainJs.slice(idx, idx + 1200);
    // Find class selectors inside chunk
    const classes = chunk.match(/\.[a-zA-Z0-9_\-]+/g) || [];
    console.log(`=== Function ${fn} ===`);
    console.log('Selectors:', [...new Set(classes)].slice(0, 8));
    console.log(chunk.slice(0, 400).replace(/\n/g, ' '));
    console.log('...\n');
  }
});
