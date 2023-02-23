import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	locals.user
	return {
		user: locals.user
	}
}) satisfies PageServerLoad

export const actions = {
	updateProfile: async ({ request }) => {
		const data = await request.formData()
		console.log(data)

		return { success: true }
	}
} satisfies Actions
