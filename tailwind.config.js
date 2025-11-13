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
      colors: {
        // Primary colors (cyan)
        primary: '#06B6D4',
        'primary-hover': '#0891B2',
        // Brand pink colors (custom pink shades)
        'brand-pink': {
          DEFAULT: '#ec4899',
          light: '#f472b6',
          lighter: '#f9a8d4',
        },
        // Brand gray colors (custom gray shades)
        'brand-gray-dark': '#374151',
        'brand-gray-darker': '#4b5563',
        // Wheel of Fortune colors
        wheel: {
          pink: '#F76C9B',
          blue: '#6EC1E4',
          green: '#63D9A0',
          yellow: '#F8D44C',
          orange: '#FFA85C',
          purple: '#B488E4',
          teal: '#5ED3C3',
          coral: '#F7A7A3',
        },
        
        // Scrollbar colors
        scrollbar: {
          DEFAULT: '#9ca3af',
          hover: '#6b7280',
        },
      },
    },
  },
  plugins: [],
}

