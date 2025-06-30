/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-up': 'scaleUp 0.6s ease-out forwards',
        'morph-logo': 'morphLogo 1s ease-in-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        morphLogo: {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(0.8)', filter: 'brightness(0.8)' },
          '100%': { transform: 'scale(0.1)', filter: 'brightness(0.3)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 20px rgba(193, 171, 120, 0.3))' },
          '50%': { filter: 'brightness(1.2) drop-shadow(0 0 30px rgba(193, 171, 120, 0.6))' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        'cinematic': '0.2em',
        'wide': '0.1em',
      }
    },
  },
  plugins: [],
} 