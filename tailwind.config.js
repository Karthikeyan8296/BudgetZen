/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#a3e635",
        primaryLight: "#0ea5e9",
        primaryDark: "#0369a1",
        text: "#fff",
        textLight: "#e5e5e5",
        textLighter: "#d4d4d4",
        white: "#fff",
        black: "#000",
        rose: "#ef4444",
        green: "#16a34a",
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          350: "#CCCCCC",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      spacing: {
        x: {
          3: "3px",
          5: "5px",
          7: "7px",
          10: "10px",
          12: "12px",
          15: "15px",
          20: "20px",
          25: "25px",
          30: "30px",
          35: "35px",
          40: "40px",
        },
        y: {
          5: "5px",
          7: "7px",
          10: "10px",
          12: "12px",
          15: "15px",
          17: "17px",
          20: "20px",
          25: "25px",
          30: "30px",
          35: "35px",
          40: "40px",
          50: "50px",
          60: "60px",
        },
      },
      borderRadius: {
        3: "3px",
        6: "6px",
        10: "10px",
        12: "12px",
        15: "15px",
        17: "17px",
        20: "20px",
        30: "30px",
      },
    },
  },
  plugins: [],
};
