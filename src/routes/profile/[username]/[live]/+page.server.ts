import type { PageServerLoad } from '../$types'
import { get } from '$lib/api'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ params }: { params: any }) => {
	const profile = await get(`users/search/username?username=${params.username}`)
	const channelId = await get(`channel/live?userId=${profile._id}`)
	if (channelId) {
		throw redirect(303, `/channel/${channelId}`)
	} else {
		throw redirect(303, `/profile/${params.username}`)
	}
}) satisfies PageServerLoad
