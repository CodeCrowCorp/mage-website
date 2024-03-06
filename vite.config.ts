import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
    plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "code-crow-corp",
            project: "mage-website"
        }
    }), sveltekit()],

    define: {
		__VERSION__: JSON.stringify(process.env.npm_package_version)
	},

    build: {
		assetsInlineLimit: 0
	}
}

export default config