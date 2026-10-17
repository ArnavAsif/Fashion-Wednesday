const fs = require('fs');
const css = fs.readFileSync('scratch/serotoninn_main.css', 'utf8');

// Find all @media blocks containing .menu
const lines = css.split('}');
let currentMedia = '';
for (let chunk of lines) {
  if (chunk.includes('@media')) {
    currentMedia = chunk.slice(chunk.indexOf('@media'));
  }
  if (chunk.includes('.menu')) {
    console.log('--- MEDIA:', currentMedia.slice(0, 50));
    console.log(chunk.replace(/\s+/g, ' ').slice(0, 150));
  }
}
