/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#173B65', // Navy blue
          dark: '#0F2744',
          light: '#23538A',
        },
        secondary: {
          DEFAULT: '#2878C8', // Medical blue
          dark: '#1E62A6',
          light: '#4B93DC',
        },
        surface: {
          DEFAULT: '#F5F7FB', // Light grey background
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#EEF2F6',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#065F46',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#92400E',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
