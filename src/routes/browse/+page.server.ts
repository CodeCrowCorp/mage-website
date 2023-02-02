import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getMyChannels, getChannels } from '$lib/stores/channelStore'

export const load = (async ({ params }) => {
	// const channels = await getChannels({ skip: 0, limit: 50 })
	// if (channels) {
	// 	return { channels }
	// }
	// throw error(404, 'Not found')
}) satisfies PageServerLoad
