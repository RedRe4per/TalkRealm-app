/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#3C486B",
          400: "#181D2A",
          300: "#2A334B",
          200: "#4F5F8D",
          100: "#6577A9",
        },
        secondary: {
          DEFAULT: "#F0F0F0",
          400: "#A3A3A3",
          300: "#BDBDBD",
          200: "#D6D6D6",
          100: "#FFFFFF",
        },
        ternary: {
          DEFAULT: "#F9D949",
          400: "#D4AF07",
          300: "#F7CF17",
          200: "#FBE37A",
          100: "#FCEDAB",
        },
        quaternary: {
          DEFAULT: "#F45050",
          400: "#D30D0D",
          300: "#F12222",
          200: "#F78282",
          100: "#FAB2B2",
        },
      },
      opacity: {
        15: ".15",
      },
      fontSize: {
        "heading-large-1": [
          "4.5rem",
          {
            lineHeight: "100%",
            fontWeight: "700",
          },
        ],
        "heading-large-2": [
          "3.75rem",
          {
            lineHeight: "100%",
            fontWeight: "700",
          },
        ],
        "heading-large-3": [
          "3rem",
          {
            lineHeight: "100%",
            fontWeight: "700",
          },
        ],
        "heading-large-4": [
          "2.25rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-large-5": [
          "1.875rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-large-6": [
          "1.25rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-large-7-standard": [
          "1rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-large-8": [
          "0.875rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-small-1": [
          "3.75rem",
          {
            lineHeight: "100%",
            fontWeight: "700",
          },
        ],
        "heading-small-2": [
          "3rem",
          {
            lineHeight: "100%",
            fontWeight: "700",
          },
        ],
        "heading-small-3": [
          "2.25rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-small-4": [
          "1.875rem",
          {
            lineHeight: "133%",
            fontWeight: "700",
          },
        ],
        "heading-small-5": [
          "1.5rem",
          {
            lineHeight: "133%",
            fontWeight: "700",
          },
        ],
        "heading-small-6": [
          "1.25rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-small-7-standard": [
          "1rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "heading-small-8": [
          "0.875rem",
          {
            lineHeight: "120%",
            fontWeight: "700",
          },
        ],
        "text-10": [
          "3.75rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-9": [
          "3rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-8": [
          "2.25rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-7": [
          "1.875rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-6": [
          "1.5rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-5": [
          "1.25rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-4": [
          "1.125rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-3-standard": [
          "1rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-2": [
          "0.875rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
        "text-1": [
          "0.75rem",
          {
            lineHeight: "150%",
            fontWeight: "400",
          },
        ],
      },
      screens: {
        custom3xl: "1950px",
        custom4xl: "2400px",
        custom5xl: "2850px",
      },
    },
  },
  plugins: [],
};
