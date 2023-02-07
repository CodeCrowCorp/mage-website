import type { PageServerLoad } from './$types'
import { searchQuery, getChannels } from '$lib/stores/channelStore'
import { get } from '$lib/api'

export const load = (async ({ locals, url }) => {
	const query = url.searchParams.get('q')
	const mostActiveChannels = await get(`channels/most-active?skip=${0}&limit=${5}`)
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

	let searchList = []
	if (query !== null) {
		searchList = await get(`channels?searchQuery=${query}&skip=${0}&limit=${50}`)
	}

	return {
		post: {
			mostActiveChannels,
			weeklyChannels,
			highestRankedUsers,
			risingStarUsers,
			myChannels,
			favChannels,
			tableChannels,
			searchList
		},
		query
	}
}) satisfies PageServerLoad
