const fs = require('fs');
let code = fs.readFileSync('scratch/menu_extracted.js', 'utf8');

// Replace semicolons and curly braces with newlines for basic readability
let formatted = code
  .replace(/;/g, ';\n')
  .replace(/\{/g, '{\n')
  .replace(/\}/g, '\n}\n');

fs.writeFileSync('scratch/menu_formatted.js', formatted);
console.log('Formatted lines:', formatted.split('\n').length);
