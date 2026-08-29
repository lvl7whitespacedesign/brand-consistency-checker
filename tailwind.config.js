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
          bg: "#0B0F14",      // LVL7 near-black base -- replace with your exact hex
          primary: "#00E5C7", // LVL7 signature accent (electric teal) -- replace with your exact hex
          accent: "#7C5CFF",  // secondary accent (violet) -- replace with your exact hex
          light: "#F5F7FA",
          danger: "#FF4D5E"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
