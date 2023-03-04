import { get } from '$lib/api'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	return {
		lazy: {
			mostActiveChannels: get(`channels/most-active?skip=${0}&limit=${5}`),
			weeklyChannels: get(`channels/weekly?skip=${0}&limit=${10}`),
			highestRankedUsers: get(`users/highest-ranked?skip=${0}&limit=${10}`),
			risingStarUsers: get(`users/rising-stars?skip=${0}&limit=${10}`),
			myChannels: locals.user
				? get(`channels/me/hosted?skip=${0}&limit=${10}`, {
						userId: locals.user.userId,
						token: locals.user.token
				  })
				: [],
			favChannels: locals.user
				? get(`channels/me/fav?skip=${0}&limit=${10}`, {
						userId: locals.user.userId,
						token: locals.user.token
				  })
				: [],
			tableChannels: get(`channels?skip=${0}&limit=${50}`)
		}
	}
}) satisfies PageServerLoad
