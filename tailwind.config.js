/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0A0A0A",
          primary: "#00E5C7",
          accent: "#7C5CFF",
          light: "#F5F7FA",
          danger: "#FF4D5E",
          gold: "#caa327",
          purple: "#9966cc",
          green: "#9acd66"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
