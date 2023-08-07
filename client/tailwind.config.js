/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        robotomono: ["Roboto Mono", "monospace"],
      },
      colors: {
        "fallout-green": "#33DD7E",
      },
      backgroundImage: {
        "game-table": "url('../public/png/tops_logo.png')",
        "vault-boy": "url('assets/test.png')",
      },
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
