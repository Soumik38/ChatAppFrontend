/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#1476ff",
        'secondary': "#FF4D4D",
        'light': "#FFB3B3",
      },
    },
  },
  plugins: [],
}