import type { Actions } from './$types'
import { patch } from '$lib/api'

export const actions = {
	'update-email': async ({ request, locals }: { request: any; locals: any }) => {
		const { userId, token } = locals.user
		const data = await request.formData()
		const email = data.get('email')
		await patch('users/current', { email }, { userId, token })
		locals.user.user.email = email
		return { success: true }
	}
} satisfies Actions
