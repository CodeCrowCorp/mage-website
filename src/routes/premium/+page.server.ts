import { get } from '$lib/api'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	return {
		lazy: {
			plans: get('plans', {
				userId: locals.user?.userId,
				token: locals.user?.token
			})
		}
	}
}) satisfies PageServerLoad
