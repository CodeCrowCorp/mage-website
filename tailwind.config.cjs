module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {},
	daisyui: {
		themes: ['light', 'dark']
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('daisyui'),
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('tailwind-clip-path')
	]
}
