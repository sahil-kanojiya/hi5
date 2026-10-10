/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        lobster: ['Lobster', 'cursive'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        'toast-enter': 'toast-enter  0.3s ease-out',
        'toast-leave': 'toast-leave 0.3s ease-in',
      },
      keyframes: {
        'toast-enter': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'toast-leave': {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(20px)' },
        },
      },
    },
  },
  plugins: [],
};
