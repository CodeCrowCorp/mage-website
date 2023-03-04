import type { PageServerLoad } from './$types'
import { getChannel } from '$lib/stores/channelStore'

export const load = (async ({ params, locals }) => {
	const userId = locals?.user?.userId || ''
	const username = locals?.user?.user?.username || ''
	return {
		lazy: {
			channel: getChannel({ channelId: params.channelId })
		},
		channelId: params.channelId,
		userId,
		username
	}
}) satisfies PageServerLoad
