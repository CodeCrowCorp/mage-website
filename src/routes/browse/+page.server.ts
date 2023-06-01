import type { Actions, PageServerLoad } from './$types'
import { get, post } from '$lib/api'
import { redirect } from '@sveltejs/kit'
import { getSectionUrl } from '$lib/utils'

export const load = (async ({ locals }) => {

	return {
		lazy: {
			mostActiveChannels: await get(
				getSectionUrl({ sectionId: 'most-active', query: '', skip: 0, limit: 5 })
			),
			weeklyChannels: await get(getSectionUrl({ sectionId: 'weekly', query: '', skip: 0, limit: 10 })),
			highestRankedUsers: await get(
				getSectionUrl({ sectionId: 'highest-ranked', query: '', skip: 0, limit: 10 })
			),
			risingStarUsers: await get(
				getSectionUrl({ sectionId: 'rising-stars', query: '', skip: 0, limit: 150 })
			),
			myChannels: locals.user
				? await get(
						`${getSectionUrl({ sectionId: 'my', query: '', skip: 0, limit: 10 })}&userId=${
							locals.user?.userId
						}`
				  )
				: [],
			favChannels: locals.user
				? await get(getSectionUrl({ sectionId: 'fav', query: '', skip: 0, limit: 10 }), {
						userId: locals.user.userId,
						token: locals.user.token
				  })
				: [],
			tableChannels: await get(getSectionUrl({ sectionId: '', query: '', skip: 0, limit: 100 }))
		}
	}
}) satisfies PageServerLoad

export const actions = {
	'create-channel': async ({ request, locals }: { request: any; locals: any }) => {
		const { userId, token } = locals.user
		const data = await request.formData()
		const newChannel = data.get('newChannel')
		const channel = await post('channel', JSON.parse(newChannel), {
			userId,
			token
		})
		throw redirect(303, `/channel/${channel._id}`)
	}
} satisfies Actions
