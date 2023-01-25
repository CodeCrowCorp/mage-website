import adapter from '@sveltejs/adapter-cloudflare'
import preprocess from 'svelte-preprocess'
import { sveltePreprocessSvg } from '@svitejs/svelte-preprocess-svg'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors

	kit: {
    	adapter: adapter({
      	fallback: 'index.html',
    	})
	},
	prerender: {
		entries: [],
	  },

	ssr: false,

	  // hydrate the <div id="svelte"> element in src/app.html
	target: '#svelte',
	preprocess: [
        preprocess({
		    postcss: true
        }),
        sveltePreprocessSvg({
			// svgo: true,
		}),
],

};

export default config;
