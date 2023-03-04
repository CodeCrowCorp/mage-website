import type { Actions, PageServerLoad } from './$types'
import { get } from '$lib/api'

export const load = (async ({ params, locals }) => {
	// return {
	// 	profile: get(`users/search/username?username=${params.customUsername}`),
	// 	lazy: {
	// 		myChannels: locals.user
	// 			? get(`channels/me/hosted?skip=${0}&limit=${10}`, {
	// 					userId: locals.user.userId,
	// 					token: locals.user.token
	// 			  })
	// 			: [],
	// 		mySubscribers: locals.user
	// 			? get(
	// 					`subscribe?source=${
	// 						locals.user.userId
	// 					}&sourceType=${'source2'}&searchQuery=${''}&skip=${0}&limit=${10}`,
	// 					{
	// 						userId: locals.user.userId, // here need to pass userId and token of fetched user from {profile}
	// 						token: locals.user.token
	// 					}
	// 			  )
	// 			: []
	// 	}
	// }
}) satisfies PageServerLoad

export const actions = {
	updateProfile: async ({ request }) => {
		const data = await request.formData()
		console.log(data)
		//TODO: call update profile api here

		return { success: true }
	}
} satisfies Actions
