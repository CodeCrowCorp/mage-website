import { get, post } from '$lib/api'
import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	return {
		lazy: {
			plans: get('plans', {
				userId: locals.user?.userId,
				token: locals.user?.token
			})
		}
	}
}) satisfies PageServerLoad

export const actions = {
	subscribe: async ({ request, locals }: { request: any; locals: any }) => {
		const { userId, token, user } = locals.user
		const data = await request.formData()
		const priceId = data.get('priceId')
		const response = await post(
			'plan/subscribe-session',
			{ priceId, username: user.username },
			{
				userId,
				token
			}
		)
		redirect(303, `${response}`)
	}
} satisfies Actions
