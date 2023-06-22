import type { Actions, PageServerLoad } from './$types'
import { get, post } from '$lib/api'
import { redirect } from '@sveltejs/kit'
import { getSectionUrl } from '$lib/utils'

export const load = (async ({ locals }) => {
	return {}
}) satisfies PageServerLoad
