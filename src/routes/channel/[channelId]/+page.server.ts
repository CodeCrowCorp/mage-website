import type { Actions, PageServerLoad } from './$types'
import { get, patch } from '$lib/api'

export const load = (async ({ params }) => {
	return {
		lazy: {
			channel: get(`channel?channelId=${params.channelId}`)
		},
		channelId: params.channelId
	}
}) satisfies PageServerLoad

export const actions = {
	'edit-channel': async ({
		request,
		locals,
		params
	}: {
		request: any
		locals: any
		params: any
	}) => {
		const { userId, token } = locals.user
		const data = await request.formData()
		const title = data.get('title')
		const description = data.get('description')
		const tags = JSON.parse(data.get('tags-selected'))
		const category = JSON.parse(data.get('category-selected'))
		const updatedChannel = { title, description, tags, category }
		await patch(`channels?channelId=${params.channelId}`, updatedChannel, {
			userId,
			token
		})
		return { success: true }
	}
} satisfies Actions
