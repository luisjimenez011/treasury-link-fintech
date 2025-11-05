/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["SF Pro Display", "system-ui", "sans-serif"],
        text: ["SF Pro Text", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

