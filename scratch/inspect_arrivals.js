const fs = require('fs');
const html = fs.readFileSync('scratch/arrivals_original.html', 'utf8');
console.log('Total length:', html.length);

// Print the beginning of the section
console.log('--- START OF SECTION ---');
console.log(html.slice(0, 2500));

// Check for swiper or cube
console.log('Contains swiper-cube?', html.includes('swiper-cube'));
console.log('Contains swiper?', html.includes('swiper'));
console.log('Contains arrivals-section__group?', html.includes('arrivals-section__group'));

