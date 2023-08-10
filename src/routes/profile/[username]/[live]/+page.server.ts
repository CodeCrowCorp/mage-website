import type { PageServerLoad } from '../$types'
import { get } from '$lib/api'
import { redirect } from '@sveltejs/kit'
import { getSectionUrl } from '$lib/utils'

export const load = (async ({ params }: { params: any }) => {
	const profile = await get(`users/search/username?username=${params.username}`)
	const channels = await get(
		`${getSectionUrl({ sectionId: 'my', query: '', skip: 0, limit: 2 })}&userId=${profile._id}`
	)
	if (channels.length) {
		throw redirect(303, `/channel/${channels[0]._id}`)
	} else {
		throw redirect(303, `/profile/${params.username}`)
	}
}) satisfies PageServerLoad
