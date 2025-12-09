/ @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chef-primary': '#FF6B00', // Tasty Orange
        'chef-secondary': '#10B981', // Fresh Teal
        'chef-dark': '#1F2937',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"], // Keeping it light and clean as per "recruiters friendly" requirement
  },
}