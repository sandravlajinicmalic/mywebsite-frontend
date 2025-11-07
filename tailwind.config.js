/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Red Hat Text"', 'sans-serif'],
        heading: ['"Barlow Semi Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

