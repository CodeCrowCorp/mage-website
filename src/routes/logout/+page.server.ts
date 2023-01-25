import { redirect } from '@sveltejs/kit'
import { userRole, currentUser } from '$lib/stores/authStore'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
	userRole.set(null)
	currentUser.set(null)

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
