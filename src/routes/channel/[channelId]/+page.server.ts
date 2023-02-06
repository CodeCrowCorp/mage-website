import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getChannel } from '$lib/stores/channelStore'

export const load = (async ({ params }) => {
	const post = await getChannel({ channelId: params.channelId })
	if (post) {
		return {
			post
		}
	}
	throw error(404, 'Not found')
}) satisfies PageServerLoad
