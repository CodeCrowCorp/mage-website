import { putImage } from '$lib/api'
import { dataURLtoFile } from '$lib/utils'
import type { Actions } from './$types'

export const actions = {
	'edit-channel': async ({ request, locals }) => {
		const data: FormData = await request.formData()
		const thumbnail = data.get('thumbnail') as File
		const imageSrc = data.get('imageSrc') as string
		const channelId = data.get('channelId') as string
		const file =
			thumbnail !== null && thumbnail.size > 0
				? thumbnail
				: dataURLtoFile(imageSrc, 'thumbnail-image')
		console.log(file)
		if (file !== null && file.size > 0 && file.type !== '') {
			await putImage(`channels/thumbnail?channelId=${channelId}&bucketName=thumbnails`, file, {
				userId: locals.user.userId,
				token: locals.user.token
			})
		}
		return { success: true }
	}
} satisfies Actions
