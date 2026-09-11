/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        netra: {
          bg: '#060b18',
          surface: '#0c1425',
          'surface-2': '#111d33',
          border: '#1a2744',
          'border-light': '#243352',
          accent: '#00d4ff',
          'accent-dim': '#0891b2',
          danger: '#ef4444',
          'danger-dim': '#991b1b',
          warning: '#f59e0b',
          success: '#22c55e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'Roboto Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
