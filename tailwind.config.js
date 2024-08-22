/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F316F',
        secondary: '#F9DBBA',
        accent: '#5B99C2',
        dark: '#1A4870',
      },
      textColor: {
        primary: '#1F316F',
        secondary: '#F9DBBA',
        accent: '#5B99C2',
        dark: '#1A4870',
      },
    },
  },
  plugins: [],
}

