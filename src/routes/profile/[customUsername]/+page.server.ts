import type { Actions, PageServerLoad } from './$types'
import { get } from '$lib/api'

export const load = (async ({ params, locals }) => {
	return {
		lazy: {
			profile: get(`users/search/username?username=${params.customUsername}`),
			channels: get(`channels/me/hosted?skip=${0}&limit=${10}`),
			subscribers: get(
				`subscribe?source=${
					locals.user.userId
				}&sourceType=${'source2'}&searchQuery=${''}&skip=${0}&limit=${10}`
			),
			interests: get(
				`subscribe?source=${
					locals.user.userId
				}&sourceType=${'source2'}&searchQuery=${''}&skip=${0}&limit=${10}`
			)
		}
	}
}) satisfies PageServerLoad

export const actions = {
	updateProfile: async ({ request }) => {
		const data = await request.formData()
		console.log(data)
		//TODO: call update profile api here

		return { success: true }
	}
} satisfies Actions
