/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'rainbow-gradient':
          'linear-gradient(90deg, indigo, violet, blue, green, yellow, orange, red, indigo)',
      },
      backgroundSize: {
        200: '200% 100%',
      },
      animation: {
        'gradient-slide': 'slideGradient 5s linear infinite',
      },
      keyframes: {
        slideGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
export default config
