import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
    // const post = null

    // if (post) {
    //   return post
    // }

    // throw error(404, 'Not found')
}) satisfies PageServerLoad