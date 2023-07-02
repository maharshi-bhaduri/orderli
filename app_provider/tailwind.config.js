/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: ["./app_provider/index.html", "./app_provider/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    colors: {
      ...colors,
      "orderlee-primary": {
        100: "#f15800",
        200: "#ff5e02db"
      },
    },
  },
  plugins: [],
};
