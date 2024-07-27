/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: "11px",
        xl: "19px",
        "2xl": "23px",
        "3xl": "32px",
      },
      lineHeight: {
        72: "57.6px",
        48: "38.4px",
      },
      fontFamily: {
        sans: ["Metropolis", "sans-serif"],
      },
      colors: {
        "light-blue": "#38ACE2",
        "dark-blue": "#0F1A24",
        "light-black": "#2E2E2E",
        "light-yellow": "#FFCF79",
        grey: "#EBEBF5",
        "grey-30": "#C5C6C7",
        magenta: "#ED3293",
        error: "#F42010",
      },
      screens: {
        xs: "400px",
      },
    },
  },
  plugins: [],
};
