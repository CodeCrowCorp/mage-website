import type { Actions } from './$types'
import { patch } from '$lib/api'
import { current_user } from '$lib/stores/authStore'

export const actions = {
	'update-email': async ({ request, locals }: { request: any; locals: any }) => {
		const data = await request.formData()
		const email = data.get('email')
		await patch('users/current', { email })
		locals.user.user.email = email
		current_user.update((user) => {
			user.email = email
		})
		return { success: true }
	}
} satisfies Actions
