/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0B0D0E',
          800: '#111315',
          700: '#17191A',
          600: '#1D2022',
          500: '#25282A',
        },
        ivory: {
          DEFAULT: '#F4F2ED',
          warm: '#E9E2D3',
          muted: '#9A9A96',
        },
        bronze: {
          300: '#C9A876',
          400: '#B89A64',
          500: '#A88A5A',
          600: '#8A6F45',
          700: '#6B5634',
        },
        mahogany: {
          800: '#3A2720',
          900: '#2A1D18',
        },
        sage: {
          500: '#5B6B5A',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '"Geist"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'label': '0.18em',
        'wide-label': '0.28em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.9s ease-out forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
