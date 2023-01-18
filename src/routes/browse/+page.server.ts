import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getMyChannels, getChannels } from '$lib/stores/channelStore'

export const load = (async ({ params }) => {
    // const post = await getChannels()

    // if (post) {
    //     return post
    // }

    // throw error(404, 'Not found')
}) satisfies PageServerLoad