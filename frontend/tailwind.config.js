/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F1A2E',
          soft: '#1C2C47',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          dim: '#F3F5F8',
        },
        accent: {
          DEFAULT: '#0E7490',
          soft: '#E4F3F6',
        },
        risk: {
          high: '#B4390A',
          highSoft: '#FBEAE3',
          medium: '#B7791F',
          mediumSoft: '#FBF2E3',
          low: '#2F7A4F',
          lowSoft: '#E7F5EC',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SF Mono', 'Roboto Mono', 'monospace'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
