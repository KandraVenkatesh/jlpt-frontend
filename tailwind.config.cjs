
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        japaneasy: { DEFAULT: '#1e3a8a', light: '#3b82f6', accent: '#b91c1c' }
      },
    },
  },
  plugins: [],
}
