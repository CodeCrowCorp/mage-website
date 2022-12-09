module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('src/lib/assets/images/network-bg.png')",
      },
    }
  },
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