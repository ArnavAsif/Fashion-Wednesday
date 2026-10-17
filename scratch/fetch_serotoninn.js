const fs = require('fs');

async function check() {
  try {
    const res = await fetch('https://serotoninn.com/');
    const html = await res.text();
    console.log('HTML length:', html.length);
    fs.writeFileSync('scratch/serotoninn_index.html', html);
    
    // find script tags
    const scriptMatches = html.match(/src="([^"]+\.js[^"]*)"/g) || [];
    console.log('Scripts:', scriptMatches);

    // find css tags
    const cssMatches = html.match(/href="([^"]+\.css[^"]*)"/g) || [];
    console.log('CSS:', cssMatches);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

check();
