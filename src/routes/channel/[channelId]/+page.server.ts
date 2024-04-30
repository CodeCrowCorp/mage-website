import { putImage } from '$lib/api'
import { dataURLtoFile } from '$lib/utils'
import type { Actions } from './$types'

//TODO: get channel in server side and set SEO data

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
