const fs = require('fs');
const css = fs.readFileSync('out/_next/static/css/fea80fa1b6b77e53.css', 'utf8');

const classMatches = new Set();
const re = /\.([a-zA-Z0-9_-]+)/g;
let m;
while ((m = re.exec(css)) !== null) {
  if (m[1].includes('prod') || m[1].includes('single') || m[1].includes('detail') || m[1].includes('card') || m[1].includes('button') || m[1].includes('size') || m[1].includes('color') || m[1].includes('item')) {
    classMatches.add(m[1]);
  }
}
console.log(Array.from(classMatches).sort());
