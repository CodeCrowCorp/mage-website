import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { adminStore } from '../../lib/stores/adminStore'

export const load = (async () => {
	//const post = await adminStore.getLegalDocs()
	const post = [
		{ name: "Privacy Policy", url: "https://code-crow-legal-docs.s3.amazonaws.com/legal/privacy.pdf" },
		{ name: "Cookie Policy", url: "https://code-crow-legal-docs.s3.amazonaws.com/legal/cookie.pdf" },
		{ name: "Copyright Policy", url: "https://code-crow-legal-docs.s3.amazonaws.com/legal/copyright.pdf" },
		{ name: "GDPR Policy", url: "https://code-crow-legal-docs.s3.amazonaws.com/legal/gdpr.pdf" },
		{ name: "Terms of Service", url: "https://code-crow-legal-docs.s3.amazonaws.com/legal/terms.pdf" }
	]
	if (post) {
		return {
			post
		}
	}
	throw error(404, 'Not found')
}) satisfies PageServerLoad