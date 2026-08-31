/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        regular: ['Inter18pt-Regular'],
        bold: ['Inter18pt-Bold'],
        semiBold: ['Inter18pt-SemiBold'],
      }
    },
  },
  plugins: [],
};