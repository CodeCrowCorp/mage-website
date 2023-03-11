import type { PageServerLoad } from './$types'
import { get } from '$lib/api'

export const load = (async ({ params, locals }) => {
	return {
		lazy: {
			channel: get(`channel?channelId=${params.channelId}`)
		},
		channelId: params.channelId
	}
}) satisfies PageServerLoad
