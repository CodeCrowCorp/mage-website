import type { PageServerLoad } from './$types'

export const load = (async ({ locals, isDataRequest }) => {
	locals.user
	return {
		user: locals.user
	}
}) satisfies PageServerLoad
