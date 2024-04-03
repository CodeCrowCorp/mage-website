import type { PageServerLoad } from '../$types'
import { get } from '$lib/api'
import { error, redirect } from '@sveltejs/kit'

export const load = (async ({ params }: { params: any }) => {
	const profile = await get(`user/search/username?username=${params.username}`)
	if (profile?.error) {
		error(404)
	}
	const channelId = await get(`channel/live?userId=${profile._id}`)
	if (channelId) {
		redirect(303, `/channel/${channelId}`)
	} else {
		redirect(303, `/${params.username}`)
	}
}) satisfies PageServerLoad
