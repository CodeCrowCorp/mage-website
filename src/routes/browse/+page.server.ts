import type { PageServerLoad } from './$types'
import { get } from '$lib/api'

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
		post: {
			mostActiveChannels,
			weeklyChannels,
			highestRankedUsers,
			risingStarUsers,
			myChannels,
			favChannels,
			tableChannels
		}
	}
}) satisfies PageServerLoad
