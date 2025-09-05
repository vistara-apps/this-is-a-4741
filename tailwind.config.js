/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 35%, 95%)',
        accent: 'hsl(190, 80%, 45%)',
        primary: 'hsl(210, 70%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(210, 30%, 20%)',
        'text-secondary': 'hsl(210, 20%, 40%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(210, 50%, 20%, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.22,1,0.36,1) infinite',
      }
    },
  },
  plugins: [],
}