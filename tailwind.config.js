/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...colors,
      "orderlee-primary": {
        100: "#f15800",
        200: "#ff5e02db"
      },
    },
    extend: {},
  },
  plugins: [],
};
