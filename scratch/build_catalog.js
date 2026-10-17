const fs = require('fs');
let html = '<!DOCTYPE html><html><body style="background:#222;color:#fff;display:flex;flex-wrap:wrap;gap:15px;padding:20px;font-family:sans-serif;">';
const files = fs.readdirSync('public/images').filter(f => f.startsWith('img_') && f.endsWith('.png'));
for (const f of files) {
  html += `<div style="background:#fff;padding:8px;text-align:center;color:#000;border-radius:4px;width:120px;">
    <img src="/images/${f}" style="height:140px;width:100%;object-fit:contain;display:block;">
    <div style="font-size:11px;font-weight:bold;margin-top:4px;">${f}</div>
  </div>`;
}
html += '</body></html>';
fs.writeFileSync('public/catalog.html', html);
console.log('Written public/catalog.html');
