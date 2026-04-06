/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Familjen Grotesk', 'Arial', 'Helvetica', 'sans-serif'],
        'sans': ['Familjen Grotesk', 'Arial', 'Helvetica', 'sans-serif'],
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
          200: '#e5e5e5',
          900: '#000000',
        }
      },
      fontSize: {
        'body': ['20px', { lineHeight: '1.3' }],
        'body-md': ['28px', { lineHeight: '1.3' }],
      }
    },
  },
  plugins: [],
}
