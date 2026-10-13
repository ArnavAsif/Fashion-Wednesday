const fs = require('fs');
const css = fs.readFileSync('app/globals.css', 'utf8');

const regex = /([^{}]+)\{([^{}]+)\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  const sel = match[1].trim();
  const body = match[2].trim();
  if (sel.includes('.hero-')) {
    console.log(sel + ' {\n  ' + body.split(';').join(';\n  ') + '\n}\n');
  }
}
