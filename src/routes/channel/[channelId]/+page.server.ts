import { error, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getChannel } from '$lib/stores/channelStore'
import { emitMessageToChannel } from '$lib/websocket'

export const load = (async ({ params, locals }) => {
	const post = await getChannel({ channelId: params.channelId })
	if (post) {
		const userId = locals?.user?.userId || ''
		return {
			post,
			userId
		}
	}
	throw error(404, 'Not found')
}) satisfies PageServerLoad

export const actions = {
	'send-message': async ({
		params,
		request,
		locals
	}: {
		params: any
		request: any
		locals: any
	}) => {
		const { user } = locals?.user || ''
		const data = await request.formData()
		const chat = data.get('chat')
		const channelId = params.channelId
		const completeMessage = {
			body: chat,
			state: { timestamp: new Date().toISOString() },
			userId: user?._id || '',
			username: user?.username || '',
			channelId: channelId
		}
		emitMessageToChannel({ channelId, message: completeMessage })
		return { success: true }
	}
} satisfies Actions
