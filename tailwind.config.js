/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CSS-variable-backed tokens — work in both themes automatically
        page:      'var(--bg-page)',
        card:      'var(--bg-card)',
        subtle:    'var(--bg-subtle)',
        elevated:  'var(--bg-elevated)',
        input:     'var(--bg-input)',
        border:    'var(--border)',
        'border-strong': 'var(--border-strong)',

        // Text tokens
        'text-1': 'var(--text-primary)',
        'text-2': 'var(--text-secondary)',
        'text-3': 'var(--text-muted)',
        'text-4': 'var(--text-faint)',

        // Brand
        brand:        'var(--brand)',
        'brand-text': 'var(--brand-text)',

        // Static palette
        primary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81', 950: '#1e1b4b'
        },
        accent: {
          400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed'
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        card:       'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        brand:      'var(--shadow-brand)',
        dropdown:   'var(--shadow-dropdown)',
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'scale-in':  'scaleIn 0.3s ease-out',
        'pulse-slow':'pulse 3s ease-in-out infinite',
        'float':     'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      borderRadius: { '2xl': '16px', '3xl': '24px', '4xl': '32px' },
    }
  },
  plugins: []
}
