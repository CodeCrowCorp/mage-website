import { get, putImage } from '$lib/api'
import { dataURLtoFile } from '$lib/utils'
import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ params, url }) => {
	if (!params.channelId) error(404)
	const channel = await get(`channel?channelId=${params.channelId}`)
	if (!channel || channel?.error) {
		error(404)
	}
	return {
		seo: {
			title: channel.title,
			description: channel.description,
			image: channel.thumbnail || 'https://mage.stream/placeholder/programming-placeholder.jpg',
			imageAlt: `channel thumbnail`,
			url: url.href,
			username: channel.username
		},
		channel
	}
}) satisfies PageServerLoad

export const actions = {
	'edit-channel': async ({ request, locals }) => {
		const data: FormData = await request.formData()
		const thumbnail = data.get('thumbnail') as File
		const imageSrc = data.get('imageSrc') as string
		const channelId = data.get('channelId') as string
		const file =
			thumbnail !== null && thumbnail.size > 0
				? thumbnail
				: imageSrc
					? dataURLtoFile(imageSrc, 'thumbnail-image')
					: null
		if (file !== null && file.size > 0 && file.type !== '') {
			await putImage(`channel/thumbnail?channelId=${channelId}&bucketName=thumbnails`, file, {
				userId: locals.user.userId,
				token: locals.user.token
			})
		}
		return { success: true }
	}
} satisfies Actions
