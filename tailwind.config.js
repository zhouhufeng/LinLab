/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sampled from the Harvard Chan theme's custom colour tokens.
        crimson: '#a51c30',
        scarlet: '#cb0a26',
        brick: '#4b1b1b',
        'brick-dark': '#290a0a',
        charcoal: '#2c2828',
        slate: '#555858',
        beige: '#ffefd8',
        khaki: '#ffbf88',
        bluegreen: '#113743',
        seafoam: '#abf4c4',
        violet: '#40305d',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: { content: '68rem' },
    },
  },
  plugins: [],
}
