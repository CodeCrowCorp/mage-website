module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			backgroundImage: {
				hero: "url('src/lib/assets/images/network-bg.png')",
				utility: "url('src/lib/assets/images/utility-bg.png')",
				partnerships: "url('src/lib/assets/images/partnerships-bg.png')",
				roadmap: "url('src/lib/assets/images/roadmap-bg.png')",
				team: "url('src/lib/assets/images/team-bg.png')"
			}
		},
		clipPath: {
			utilitypolygon: 'polygon(0 0,100% 12%,100% 88%,0% 100%)',
			roadmapCardLeft: 'polygon(0 0,100% 50%,100% 50%,0% 100%)',
			roadmapCardRight: 'polygon(100% 50%,0 0,0% 100%,100% 50%)'
		}
	},
	daisyui: {
		themes: ['light', 'dark']
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('daisyui'),
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('tailwind-clip-path'),
		require('flowbite/plugin')
	]
}
