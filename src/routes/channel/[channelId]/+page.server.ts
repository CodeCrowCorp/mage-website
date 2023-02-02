import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getChannel } from '$lib/stores/channelStore'
import { getChannelSocket } from '$lib/stores/socketStore'

export const load = (async ({ params }) => {
	// await getChannelSocket({ channelId: params.channelId })
	const post = await getChannel({ channelId: params.channelId })
	if (post) {
		return {
			post
		}
	}
	throw error(404, 'Not found')
}) satisfies PageServerLoad
