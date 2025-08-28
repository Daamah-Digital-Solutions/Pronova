/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e6e3ff',
          200: '#d1c8ff',
          300: '#b59cff',
          400: '#9361ff',
          500: '#7C42FF',
          600: '#5C27FE',
          700: '#4915d9',
          800: '#3e13b3',
          900: '#35128f',
        },
        secondary: {
          50: '#f2f0ff',
          100: '#eeebff',
          200: '#d9d1fe',
          300: '#bfb0fe',
          400: '#a183fd',
          500: '#DEC7FF',
          600: '#8b5dfc',
          700: '#7847fa',
          800: '#6c36f5',
          900: '#581fe0',
        },
        dark: {
          800: '#111930',
          900: '#070A29',
        }
      },
      fontFamily: {
        sans: ['Readex Pro', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Conthrax', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glow': 'radial-gradient(circle at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
        'spin-slow-reverse': 'spin-reverse 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { opacity: 0.5, boxShadow: '0 0 20px rgba(92, 39, 254, 0.3)' },
          '100%': { opacity: 1, boxShadow: '0 0 40px rgba(92, 39, 254, 0.6)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
      },
      boxShadow: {
        'neon': '0 0 20px rgba(92, 39, 254, 0.5)',
        'neon-strong': '0 0 30px rgba(92, 39, 254, 0.7)',
      },
    },
  },
  plugins: [],
}