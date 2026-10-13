const fs = require('fs');

const html = fs.readFileSync('C:/Users/ifas0/.gemini/antigravity-cli/brain/42e0257d-cab2-4ee7-a8ba-fac49eb560a2/scratch/index_clean.html', 'utf8');

// Find start of header and end of footer
const headerStart = html.indexOf('<header class="header"');
const footerEnd = html.indexOf('</footer>') + '</footer>'.length;

const mainContent = html.slice(headerStart, footerEnd);
console.log('Main content length in index_clean.html:', mainContent.length);

// Also check any overlays like menu popup, cart, sing-up
const searchStart = html.indexOf('<div class="search">');
console.log('searchStart:', searchStart);

const cartStart = html.indexOf('<div class="cart');
console.log('cartStart:', cartStart);

const menuStart = html.indexOf('<div class="menu');
console.log('menuStart:', menuStart);

const singUpStart = html.indexOf('<div class="sing-up');
console.log('singUpStart:', singUpStart);
