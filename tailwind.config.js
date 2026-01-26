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
       'phenom': '0 4px 6px rgba(20, 12, 41, 0.1)',
       'custom-inner': 'inset 0px 4px 4px rgba(186, 186, 186, 0.25)',
       'custom-drop': '0px 4px 4px rgba(0, 0, 0, 0.14)',
       'tier-level': 'inset 0px 4px 4px rgba(186, 186, 186, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.14)'
      },
      blur: {
        377: '377px',
      },
      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
        shadows: "var(--font-shadows)",
        rubik: "var(--font-rubik)",
        inter: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-worksans)", "sans-serif"],
      }
    },
  },
  plugins: [],
}

