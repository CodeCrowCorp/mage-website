import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getChannel } from '$lib/stores/channelStore'

export const load = (async ({ params, locals }) => {
	const post = await getChannel({ channelId: params.channelId })
	if (post) {
		const userId = locals?.user?.userId || ''
		const username = locals?.user?.user?.username || ''
		return {
			post,
			userId,
			username
		}
	}
	throw error(404, 'Not found')
}) satisfies PageServerLoad
