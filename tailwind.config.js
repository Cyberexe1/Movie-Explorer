/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'bounce-in': 'bounceIn 0.8s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          to: { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        bounceIn: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.3)' 
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.05)' 
          },
          '70%': { 
            transform: 'scale(0.9)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}