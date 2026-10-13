const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    @font-face {
      font-family: Thunder;
      font-weight: 800;
      src: url('/fonts/Thunder-ExtraBoldLC.woff2') format('woff2');
    }
    body {
      background: #8b807a;
      margin: 0;
      padding: 60px;
      font-family: sans-serif;
    }
    .variant {
      margin-bottom: 40px;
    }
    .label {
      color: white;
      font-family: monospace;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    /* Variant 1: With button_bg */
    .btn1 {
      background: url('/images/button_bg.webp') no-repeat center / 100% 100%;
      border: none;
      cursor: pointer;
      padding: 1.2rem 2.4rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: Thunder, sans-serif;
      font-size: 2.6rem;
      font-weight: 800;
      text-transform: uppercase;
      color: #fff;
      letter-spacing: 0.08rem;
      line-height: 1;
      white-space: nowrap;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn1 .reveal {
      display: inline-block;
      max-width: 0;
      opacity: 0;
      transform: translateX(-10px);
      overflow: hidden;
      white-space: nowrap;
      transition: max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), margin-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      margin-left: 0;
    }
    .btn1.hovered .reveal, .btn1:hover .reveal {
      max-width: 6rem;
      opacity: 1;
      transform: translateX(0);
      margin-left: 0.4rem;
    }

    /* Variant 2: Clean typography with underline / frame */
    .btn2 {
      background: transparent;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      font-family: Thunder, sans-serif;
      font-size: 3rem;
      font-weight: 800;
      text-transform: uppercase;
      color: #fff;
      letter-spacing: 0.08rem;
      line-height: 1;
      white-space: nowrap;
    }
    .btn2 .reveal {
      display: inline-block;
      max-width: 0;
      opacity: 0;
      transform: translateX(-10px);
      overflow: hidden;
      white-space: nowrap;
      transition: max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), margin-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      margin-left: 0;
    }
    .btn2.hovered .reveal, .btn2:hover .reveal {
      max-width: 6rem;
      opacity: 1;
      transform: translateX(0);
      margin-left: 0.4rem;
    }
  </style>
</head>
<body>
  <div class="variant">
    <div class="label">Variant 1 - Brush stroke bg (initial)</div>
    <button class="btn1">
      <span>DISCOUNT</span>
      <span class="reveal">10%</span>
    </button>
  </div>
  <div class="variant">
    <div class="label">Variant 1 - Brush stroke bg (hovered)</div>
    <button class="btn1 hovered">
      <span>DISCOUNT</span>
      <span class="reveal">10%</span>
    </button>
  </div>
  <div class="variant">
    <div class="label">Variant 2 - Clean text on background (initial)</div>
    <button class="btn2">
      <span>DISCOUNT</span>
      <span class="reveal">10%</span>
    </button>
  </div>
  <div class="variant">
    <div class="label">Variant 2 - Clean text on background (hovered)</div>
    <button class="btn2 hovered">
      <span>DISCOUNT</span>
      <span class="reveal">10%</span>
    </button>
  </div>
</body>
</html>
`;
fs.writeFileSync('public/test_discount_variants.html', html);
console.log('Saved test_discount_variants.html');
