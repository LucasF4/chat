/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}"],
  theme: {
    extend: {
      animation: {
        "menu-slide": "menu-slide 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
