/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'], 
      },
      colors: {
        'bio-green': '#5A8A1A', // Darker green for WCAG AA contrast with white text (was #A3CD39)
        'bio-green-text': '#4A7515', // Even darker green for text on white backgrounds
        'green': {
          ...require('tailwindcss/colors').green,
          600: '#15803D', // Darker green-600 for better contrast (was #16A34A)
        },
      },
      animation: {
        ping: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      
    },
  },
  plugins: [],
}

