import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	// const post = await getLegalDocs()
	const post = [
		{
			name: 'Privacy Policy',
			url: 'https://legal.mage.stream/privacy.pdf'
		},
		{
			name: 'Cookie Policy',
			url: 'https://legal.mage.stream/cookie.pdf'
		},
		{
			name: 'Copyright Policy',
			url: 'https://legal.mage.stream/copyright.pdf'
		},
		{ name: 'GDPR Policy', url: 'https://legal.mage.stream/gdpr.pdf' },
		{
			name: 'Terms of Service',
			url: 'https://legal.mage.stream/terms.pdf'
		}
	]
	if (post) {
		return {
			post
		}
	}
	throw error(404, 'Not found')
}) satisfies PageServerLoad
