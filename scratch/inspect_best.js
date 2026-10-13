const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');

const pos = html.indexOf('arrivals-card__best');
console.log(html.slice(pos - 50, pos + 250));

// Search CSS for arrivals-card__best
const css = fs.readFileSync('C:/Users/ifas0/Downloads/serotoninn.full-page.Woblo/serotoninn/styles.css', 'utf8');
const regex = /\.arrivals-card__best[^{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(css)) !== null) {
  console.log(m[0]);
}
