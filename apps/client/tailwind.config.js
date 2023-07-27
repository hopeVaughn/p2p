/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      'sans': ['Roboto', 'sans-serif'],
      'serif': ['Roboto', 'serif'],
      'mono': ['Roboto', 'monospace'],
    },
    extend: {
      transitionDuration: {
        '500': '500ms',
      }
    },
  },
  plugins: [],
};
