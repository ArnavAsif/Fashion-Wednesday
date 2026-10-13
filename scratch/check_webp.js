const fs = require('fs');
// Let's check header of best_mask_desk.webp
const buf = fs.readFileSync('C:/projects-react/serotoninn/public/images/best_mask_desk.webp');
console.log('Format:', buf.subarray(0, 16).toString('hex'));
console.log('VP8X chunk?', buf.includes(Buffer.from('VP8X')));
console.log('ALPH chunk?', buf.includes(Buffer.from('ALPH')));
