/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
       'custom-header': '0 2px 8px 0 #140C2929',
       'phenom': '0 4px 6px rgba(20, 12, 41, 0.1)'
      },
      fontFamily: {
        roboto: ["var(--font-roboto)", ...fontFamily.sans],
        shadows: "var(--font-shadows)",
        rubik: "var(--font-rubik)",
        inter: ["var(--font-inter)", ...fontFamily.sans],
      }
    },
  },
  plugins: [],
}

