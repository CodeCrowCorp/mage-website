import type { Actions, PageServerLoad } from './$types'
import { get, patch } from '$lib/api'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ params, locals }) => {
	return {
		lazy: {
			profile: get(`users/search/username?username=${params.username}`),
			channels: get(`channels/me/hosted?skip=${0}&limit=${10}`),
			subscribers: get(
				`subscribe?source=${
					locals.user.userId
				}&sourceType=${'source2'}&searchQuery=${''}&skip=${0}&limit=${10}`
			),
			interests: get(
				`subscribe?source=${
					locals.user.userId
				}&sourceType=${'source2'}&searchQuery=${''}&skip=${0}&limit=${10}`
			)
		}
	}
}) satisfies PageServerLoad

export const actions = {
	'update-profile': async ({ request, locals }: { request: any; locals: any }) => {
		const data = await request.formData()
		const newUser: any = {}
		addPropertyIfDefined(data, 'displayName', newUser)
		addPropertyIfDefined(data, 'username', newUser)
		addPropertyIfDefined(data, 'website', newUser)
		addPropertyIfDefined(data, 'banner', newUser)
		addPropertyIfDefined(data, 'avatar', newUser)
		addPropertyIfDefined(data, 'category', newUser)
		addPropertyIfDefined(data, 'bio', newUser)
		const updatedUser = await patch(`users`, newUser, {
			userId: locals.user.userId,
			token: locals.user.token
		})
		locals.user.user = updatedUser
		throw redirect(303, `/profile/${updatedUser.username}`)
	}
} satisfies Actions

const addPropertyIfDefined = (
	data: FormData,
	property: string,
	newUser: { [key: string]: any }
) => {
	const propertyValue = data.get(property)
	if (propertyValue !== null && propertyValue !== undefined) {
		newUser[property] =
			property === 'category' ? JSON.parse(propertyValue.toString()) : propertyValue
	}
}
