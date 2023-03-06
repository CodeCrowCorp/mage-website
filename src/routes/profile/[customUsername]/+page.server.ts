import type { Actions, PageServerLoad } from './$types'
import { get } from '$lib/api'
import { error } from '@sveltejs/kit'

export const load = (async ({ params, locals }) => {
	const profile = await get(`users/search/username?username=${params.customUsername}`)
	if (!profile.error) {
		return {
			profile,
			lazy: {
				myChannels: locals.user
					? get(`channels/me/hosted?skip=${0}&limit=${10}`, {
							userId: profile._id,
							token: profile.token
					  })
					: [],
				mySubscribers: locals.user
					? get(
							`subscribe?source=${
								locals.user.userId
							}&sourceType=${'source2'}&searchQuery=${''}&skip=${0}&limit=${10}`,
							{
								userId: profile._id,
								token: profile.token
							}
					  )
					: []
			}
		}
	}
	throw error(400, 'Server load error')
}) satisfies PageServerLoad

export const actions = {
	updateProfile: async ({ request }) => {
		const data = await request.formData()
		console.log(data)
		//TODO: call update profile api here

		return { success: true }
	}
} satisfies Actions
