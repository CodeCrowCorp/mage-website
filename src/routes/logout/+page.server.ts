import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (() => {
	// redirect the user
	redirect(302, '/browse');
}) satisfies PageServerLoad

export const actions: Actions = {
	default({ cookies }) {
		// eat the cookie
		const cookieItem = ['token', 'userId', 'user']
		cookieItem.forEach((item) => {
			cookies.set(item, '', {
				path: '/',
				expires: new Date(0)
			})
		})

		// redirect the user
		redirect(302, '/browse');
	}
}
