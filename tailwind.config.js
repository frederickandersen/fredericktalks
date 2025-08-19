/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      screens: {
        '2xl': '2500px', // Custom breakpoint for very large screens (curved monitors)
      },
      fontFamily: {
        'serif': ['Times', 'Times New Roman', 'serif'],
        'sans': ['Times', 'Times New Roman', 'serif'], // Override default
      },
      colors: {
        'primary': {
          500: '#0D3DFF',
          600: '#0D3DFF',
          700: '#0A32CC',
        },
        'gray': {
          50: '#f7f7f7',
          100: '#cccccc',
          900: '#000000',
        }
      },
      maxWidth: {
        'container': '960px',
        'content': '520px',
      },
      fontSize: {
        'body': ['24px', { lineHeight: '1.3' }],
        'body-md': ['28px', { lineHeight: '1.3' }],
        'number': ['20px', { lineHeight: '1.1' }],
        'number-md': ['24px', { lineHeight: '1.1' }],
      }
    },
  },
  plugins: [],
} 