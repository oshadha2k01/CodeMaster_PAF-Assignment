/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#1a2a44',
        'amber': '#e9d758',
        'silver': '#d3d8e8',
        'electric-purple': '#6b5b95',
        'scarlet': '#ff4040',
        'deep-space-dark': '#0d1b2a', // Added to match your footer/header styling
      },
    },
  },
  plugins: [],
};