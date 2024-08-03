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
        "medium-overlay": "#2C353E",
        "low-overlay": "#1B252F",
        "supporting-text": "#BBBEC1",
        "primary-yellow": "#FDB913",
      },
      screens: {
        xs: "400px",
      },
      animation: {
        "slide-in-bottom": "slideInBottom 1s ease-out",
        "slide-out-bottom": "slideOutBottom 1s ease-in",
      },
      keyframes: {
        slideInBottom: {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideOutBottom: {
          "0%": {
            transform: "translateY(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
