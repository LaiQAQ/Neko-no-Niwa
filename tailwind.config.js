/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sakura: '#f2c4ce',
        'sakura-l': '#faeef1',
        sky: '#c5dce8',
        'sky-l': '#eaf3f8',
        sage: '#c9d9c8',
        cream: '#faf8f5',
        ink: '#3a3540',
        'ink-soft': '#7a7080',
        'ink-faint': '#b8b0bc',
      },
      fontFamily: {
        'kaku': ['"Zen Kaku Gothic New"', 'sans-serif'],
        'serif': ['"Noto Serif SC"', 'serif'],
        'mincho': ['"Zen Old Mincho"', 'serif'],
      },
    },
  },
  plugins: [],
}
