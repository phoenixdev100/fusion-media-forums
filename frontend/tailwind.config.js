/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'minecraft-green': '#44bd32',
        'minecraft-blue': '#0097e6',
        'minecraft-dark': '#2f3640',
        'minecraft-stone': '#7f8c8d',
        'minecraft-dirt': '#8B4513',
        'minecraft-grass': '#5D8A57',
        'minecraft-wood': '#966F33',
        'minecraft-black': '#1e272e',
        'minecraft-gold': '#fbc531',
        'minecraft-red': '#e84118',
      },
      fontFamily: {
        'minecraft': ['MinecraftFont', 'sans-serif'],
      },
      backgroundImage: {
        'dirt-pattern': "url('/static/images/dirt-background.jpg')",
        'stone-pattern': "url('/static/images/stone-background.jpg')",
      }
    },
  },
  plugins: [],
}
