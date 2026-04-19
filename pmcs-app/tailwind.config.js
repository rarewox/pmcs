/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0D1B2A',
          800: '#162236',
          700: '#1E3048',
          600: '#264059',
        },
        pmcs: {
          green: '#0F7A3D',
          'green-light': '#12904A',
          orange: '#F59E0B',
          'orange-dark': '#D97706',
          bg: '#F4F6F8',
        },
      },
    },
  },
  plugins: [],
};
