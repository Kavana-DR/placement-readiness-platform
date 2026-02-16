/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(245 58% 51%)',
        'kpb-bg': '#F7F6F3'
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '40': '40px',
        '64': '64px'
      },
      borderRadius: {
        DEFAULT: '8px'
      }
    }
  },
  plugins: []
}
