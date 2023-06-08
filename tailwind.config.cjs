module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {},
	daisyui: {
		themes: [
			{
				dark: {
					...require("daisyui/src/theming/themes")["[data-theme=dark]"],
					"base-100": "#242733",
					"neutral-content": "#2a3241",
					
				},
			},
			{
				light: {
					...require("daisyui/src/theming/themes")["[data-theme=light]"],
					"base-100": "#ffffff",
					"base-200": "#f2f2f2",
					"neutral-content": "#d7dde4",
				},
			},
			'cyberpunk', 
			'synthwave'
		]
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('daisyui'),
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('tailwind-clip-path')
	],
	variants: {
		display: ['group-hover']
	}
}
