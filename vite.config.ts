import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
	plugins: [sveltekit()],
	define: {
		__VERSION__: JSON.stringify(process.env.npm_package_version)
	},
	build: {
		assetsInlineLimit: 0
	}
}

export default config
