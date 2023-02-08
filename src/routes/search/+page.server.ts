import { get } from '$lib/api'
import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
	const query = url.searchParams.get('q')

	const searchList = await get(`channels?searchQuery=${query}&skip=${0}&limit=${20}`)

	return {
		post: {
			searchList
		},
		query
	}
}) satisfies PageServerLoad
