// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(210, 80%, 50%)",
        secondary: "hsl(10, 70%, 50%)"
      }
    }
  },
  darkMode: "class",
  plugins: []
};
