import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { adminStore } from '../../lib/stores/adminStore'

export const load = (async () => {
	// const post = null; //await adminStore.getLegalDocs()

	// if (post) {
	// 	return post
	// }

	// throw error(404, 'Not found')
}) satisfies PageServerLoad