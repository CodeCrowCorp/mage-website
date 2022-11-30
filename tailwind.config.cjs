module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],
  theme: { extend: {} },
  daisyui: {
    themes: [
      "light",
      "dark"
    ],
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require("daisyui"),
    require('tailwind-scrollbar'),
  ]
}