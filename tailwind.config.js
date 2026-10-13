/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        thunder: ['Thunder', 'sans-serif'],
        fraktion: ['PP Fraktion Mono', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: '#ff3b30',
      }
    },
  },
  plugins: [],
};
