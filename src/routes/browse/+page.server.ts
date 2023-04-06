import type { Actions, PageServerLoad } from './$types'
import { get, post } from '$lib/api'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ locals }) => {
	const mostActiveChannels = await get(`channels/most-active?skip=${0}&limit=${5}`)
	console.log("most active channels")
	console.log(mostActiveChannels)
	const weeklyChannels = await get(`channels/weekly?skip=${0}&limit=${10}`)
	const highestRankedUsers = await get(`users/highest-ranked?skip=${0}&limit=${10}`)
	const risingStarUsers = await get(`users/rising-stars?skip=${0}&limit=${10}`)
	let myChannels = []
	let favChannels = []
	if (locals.user) {
		myChannels = await get(`channels/me/hosted?skip=${0}&limit=${10}`)
		favChannels = await get(`channels/me/fav?skip=${0}&limit=${10}`)
	}
	const tableChannels = await get(`channels?searchQuery=&skip=${0}&limit=${50}`)

	return {
		lazy: {
			mostActiveChannels: get(`channels/most-active?skip=${0}&limit=${5}`),
			weeklyChannels: get(`channels/weekly?skip=${0}&limit=${10}`),
			highestRankedUsers: get(`users/highest-ranked?skip=${0}&limit=${10}`),
			risingStarUsers: get(`users/rising-stars?skip=${0}&limit=${10}`),
			myChannels: locals.user
				? get(`channels/user?userId=${locals.user.userId}&skip=${0}&limit=${10}`)
				: [],
			favChannels: locals.user
				? get(`channels/me/fav?skip=${0}&limit=${10}`, {
						userId: locals.user.userId,
						token: locals.user.token
				  })
				: [],
			tableChannels: get(`channels?skip=${0}&limit=${100}`)
		}
	}
}) satisfies PageServerLoad

export const actions = {
	'create-channel': async ({ request, locals }: { request: any; locals: any }) => {
		const { userId, token } = locals.user
		const data = await request.formData()
		const newChannel = data.get('newChannel')
		const channel = await post('channel', JSON.parse(newChannel), {
			userId,
			token
		})
		throw redirect(303, `/channel/${channel._id}`)
	}
} satisfies Actions
