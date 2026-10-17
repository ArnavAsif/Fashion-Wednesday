const fs = require('fs');

async function download() {
  const jsRes = await fetch('https://serotoninn.com/wp-content/themes/ref/js/main.js');
  const js = await jsRes.text();
  fs.writeFileSync('scratch/serotoninn_main.js', js);
  console.log('Saved main.js, length:', js.length);

  const cssRes = await fetch('https://serotoninn.com/wp-content/themes/ref/css/main.css');
  const css = await cssRes.text();
  fs.writeFileSync('scratch/serotoninn_main.css', css);
  console.log('Saved main.css, length:', css.length);
}

download();
