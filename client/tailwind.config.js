/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        robotomono: ["Roboto Mono", "monospace"],
      },
      colors: {
        "fallout-green": "#33DD7E",
      },
      backgroundImage: {
        "game-table": "url('/png/tops_logo.png')",
        "vault-boy": "url('/src/assets/test.png')",
      },
    },
  },
  plugins: [],
};
