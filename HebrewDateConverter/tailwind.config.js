// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px', // Extra small screen support
      },
      animation: {
        'slide-left': 'slideLeft 0.2s ease-in-out',
        'slide-right': 'slideRight 0.2s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-in-out',
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(10%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      touchAction: ['responsive'],
      fontSize: {
        'xxs': '0.65rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 6px 0 rgba(0, 0, 0, 0.1)',
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}