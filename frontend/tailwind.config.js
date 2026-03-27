/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          white: '#FFFFFF',
          gold: '#C5A059',
          black: '#111111',
          cream: '#FAF9F6',
          charcoal: '#333333',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        noto: ['var(--font-noto-serif)', 'serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
      },
      letterSpacing: {
        elite: '0.2em',
        luxury: '0.1em',
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(197, 160, 89, 0.08)',
        'luxury-hover': '0 20px 50px rgba(197, 160, 89, 0.15)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
