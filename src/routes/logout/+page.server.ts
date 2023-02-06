import { redirect } from '@sveltejs/kit'
import { current_user, user_role } from '$lib/stores/authStore'
import type { PageServerLoad } from './$types'

export const load = (async ({ cookies, locals }) => {
	current_user.set(null)
	user_role.set(null)
	locals.user = {
		token: '',
		userId: '',
		user: undefined
	}
	locals.isBanned = false

	// eat the cookie
	const cookieItem = ['token', 'userId', 'user']
	cookieItem.forEach((item) => {
		cookies.set(item, '', {
			path: '/',
			expires: new Date(0)
		})
	})

	// redirect the user
	throw redirect(302, '/browse')
}) satisfies PageServerLoad
