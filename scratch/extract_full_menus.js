const fs = require('fs');
const html = fs.readFileSync('scratch/serotoninn_index.html', 'utf8');

function extractTag(html, startPattern, endPattern) {
  const start = html.indexOf(startPattern);
  if (start === -1) return '';
  const end = html.indexOf(endPattern, start);
  return html.slice(start, end !== -1 ? end + endPattern.length : start + 10000);
}

// Extract .menu--menu
const menuMenu = extractTag(html, 'class="menu menu--menu"', '</section>'); // or closing tag
// Let's find end of menu--menu
const mStart = html.indexOf('class="menu menu--menu"');
const cStart = html.indexOf('class="menu menu--categories"');
console.log('mStart:', mStart, 'cStart:', cStart);

if (mStart !== -1 && cStart !== -1) {
  const mHtml = html.slice(mStart - 25, cStart);
  fs.writeFileSync('scratch/full_menu_menu.html', mHtml);
  console.log('Saved full_menu_menu.html, length:', mHtml.length);
}

const cEnd = html.indexOf('</header>', cStart) !== -1 ? html.indexOf('</header>', cStart) : html.indexOf('<main', cStart);
if (cStart !== -1) {
  const cHtml = html.slice(cStart - 25, cEnd !== -1 ? cEnd : cStart + 15000);
  fs.writeFileSync('scratch/full_menu_categories.html', cHtml);
  console.log('Saved full_menu_categories.html, length:', cHtml.length);
}
