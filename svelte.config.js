import adapter from '@sveltejs/adapter-cloudflare'
import preprocess from 'svelte-preprocess'
import { sveltePreprocessSvg } from '@svitejs/svelte-preprocess-svg'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		}),
		sveltePreprocessSvg({
			svgo: true
		})
	],

	kit: {
		adapter: adapter()
	}
}

export default config
