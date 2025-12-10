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

theme: {
  extend: {
    keyframes: {
      fall: {
        '0%': { transform: 'translateY(-10px)', opacity: 1 },
        '100%': { transform: 'translateY(600px)', opacity: 0 },
      },
      steam: {
        '0%': { transform: 'translateY(0) scale(1)', opacity: 0.3 },
        '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: 0.6 },
        '100%': { transform: 'translateY(-40px) scale(1.5)', opacity: 0 },
      },
      bounceSlow: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-20px)' },
      },
      bounceFast: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-30px)' },
      },
      bounceDelay: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-25px)' },
      },
    },
    animation: {
      fall: 'fall 4s linear infinite',
      steam: 'steam 3s ease-in-out infinite',
      'bounce-slow': 'bounceSlow 4s ease-in-out infinite',
      'bounce-fast': 'bounceFast 3s ease-in-out infinite',
      'bounce-delay': 'bounceDelay 3.5s ease-in-out infinite',
      'pulse-slow': 'pulse 3s ease-in-out infinite',
      'slideIn': 'slideIn 1s ease-out forwards',
    },
  },
},
