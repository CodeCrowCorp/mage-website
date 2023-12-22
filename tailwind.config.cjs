module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {},
	daisyui: {
		themes: ['dark', 'light', 'cyberpunk', 'synthwave']
	},
	plugins: [require('daisyui'), require('tailwind-scrollbar')({ nocompatible: true })],
	variants: {
		display: ['group-hover']
	}
}
