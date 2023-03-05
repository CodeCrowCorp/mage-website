import type { PageServerLoad } from './$types'
import { get } from '$lib/api'

export const load = (async ({ params, locals }) => {
	const userId = locals?.user?.userId || ''
	const username = locals?.user?.user?.username || ''
	return {
		lazy: {
			channel: get(`channel?channelId=${params.channelId}`)
		},
		channelId: params.channelId,
		userId,
		username
	}
}) satisfies PageServerLoad
