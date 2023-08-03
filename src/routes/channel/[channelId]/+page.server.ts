import { putImage } from '$lib/api'
import type { Actions } from './$types'

const dataURLtoFile = (dataurl: string, filename: string) => {
	const arr = dataurl.split(',')
	const mime = (arr[0] && arr[0].match(/:(.*?);/)?.[1]) || ''
	const bstr = atob(arr[1])
	let n = bstr.length
	const u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], filename, { type: mime })
}

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
