/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      borderRadius: {
        '4xl': 'var(--radius-4xl)',
      },
      animation: {
        'move-x': 'move-x var(--move-duration, 1s) var(--move-ease, linear) var(--move-delay, 0s) var(--move-direction, normal) var(--move-fill-mode, none) var(--move-iteration-count, 1)',
      },
      keyframes: {
        'move-x': {
          '0%': { transform: 'translateX(var(--move-x-from))' },
          '100%': { transform: 'translateX(var(--move-x-to))' },
        },
      },
      backgroundImage: {
        'linear-115': 'linear-gradient(115deg, var(--tw-gradient-stops))',
        'linear-145': 'linear-gradient(145deg, var(--tw-gradient-stops))',
        'linear-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
        'linear-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      aspectRatio: {
        '9/16': '9 / 16',
        '3/4': '3 / 4',
      },
      spacing: {
        '2.5': '0.625rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
          '7xl': '8rem',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addVariant }) {
      addVariant('data-hover', '&:hover')
    },
  ],
} 