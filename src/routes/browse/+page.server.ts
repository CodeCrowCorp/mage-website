import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getMyChannels, getChannels, searchQuery } from '$lib/stores/channelStore'

export const load = (async ({ params, url }) => {
	const q = url.searchParams.get('q')
	if (q !== null) {
		searchQuery.set(q)
		const search_channels = await getChannels({ skip: 0, limit: 20 })

		return {
			search_channels
		}
	}
	// if (channels) {
	// 	return { channels }
	// }
	// throw error(404, 'Not found')
}) satisfies PageServerLoad

/** @type {import('./$types').Actions} */
export const actions = {
	search: async (event) => {}
}
