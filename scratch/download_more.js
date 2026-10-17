const fs = require('fs');

async function downloadAll() {
  const files = ['loader.js', 'footer-anim.js', 'custom-cursor.js', 'arrivals-anim.js'];
  for (const f of files) {
    try {
      const res = await fetch(`https://serotoninn.com/wp-content/themes/ref/js/${f}`);
      const text = await res.text();
      fs.writeFileSync(`scratch/${f}`, text);
      console.log(`Saved ${f}, size: ${text.length}`);
    } catch (e) {
      console.error(`Error ${f}:`, e);
    }
  }
}

downloadAll();
