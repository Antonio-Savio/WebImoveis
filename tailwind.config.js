/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#818181'
      },

      screens: {
        'xs': '380px'
      }
    },
  },
  plugins: [],
}

