import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getUserByUsername } from '$lib/stores/userStore'

export const load = (async ({ locals }) => {
	return {
		user: locals.user
	}
}) satisfies PageServerLoad

// export const load = (async ({ params }) => {
// const res = await getUserByUsername({ username: params.customUsername })
// if (res) {
// 	return {
// 		data: res
// 	}
// }
// throw error(404, 'Not found')
// }) satisfies PageServerLoad
