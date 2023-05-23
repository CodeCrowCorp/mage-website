import type { Actions, PageServerLoad } from './$types'
import { get, post } from '$lib/api'
import { redirect } from '@sveltejs/kit'
import { getSectionUrl } from '$lib/utils'

export const load = (async ({ locals }) => {
	return {
		// tableChannels: get(`channels?skip=${0}&limit=${100}`),
		mostActiveChannels: get(
			getSectionUrl({ sectionId: 'most-active', query: '', skip: 0, limit: 5 })
		),
		lazy: {
			mostActiveChannels: get(
				getSectionUrl({ sectionId: 'most-active', query: '', skip: 0, limit: 5 })
			),
			weeklyChannels: get(getSectionUrl({ sectionId: 'weekly', query: '', skip: 0, limit: 10 })),
			highestRankedUsers: get(
				getSectionUrl({ sectionId: 'highest-ranked', query: '', skip: 0, limit: 10 })
			),
			risingStarUsers: get(
				getSectionUrl({ sectionId: 'rising-stars', query: '', skip: 0, limit: 10 })
			),
			myChannels: locals.user
				? get(
						`${getSectionUrl({ sectionId: 'my', query: '', skip: 0, limit: 10 })}&userId=${
							locals.user?.userId
						}`
				  )
				: [],
			favChannels: locals.user
				? get(getSectionUrl({ sectionId: 'fav', query: '', skip: 0, limit: 10 }), {
						userId: locals.user.userId,
						token: locals.user.token
				  })
				: [],
			tableChannels: get(getSectionUrl({ sectionId: '', query: '', skip: 0, limit: 100 }))
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
