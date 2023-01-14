import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
	// eat the cookie
	const cookieItem = ['token', 'userId']

	cookieItem.forEach((item) => {
		cookies.set(item, '', {
			path: '/',
			expires: new Date(0)
		})
	})

	// redirect the user
	throw redirect(302, '/browse')
}
