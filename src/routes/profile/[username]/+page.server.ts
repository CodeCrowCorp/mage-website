import type { Actions, PageServerLoad } from './$types'
import { get, patch } from '$lib/api'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ params, locals }) => {
	const profile = await get(`users/search/username?username=${params.username}`)
	return {
		profile: profile,
		lazy: {
			channels: get(`channels/user?userId=${profile._id}skip=${0}&limit=${10}`),
			subscribers: get(
				`subscribes?source=${profile._id}&sourceType=source1&skip=${0}&limit=${10}`,
				{ userId: locals.user?.userId, token: locals.user?.token }
			),
			interests: get(`subscribes?source=${profile._id}&sourceType=source2&skip=${0}&limit=${10}`, {
				userId: locals.user?.userId,
				token: locals.user?.token
			}),
			subscriberCount: get(`subscribes/count?source=${profile._id}&sourceType=source1`),
			interestCount: get(`subscribes/count?source=${profile._id}&sourceType=source2`)
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
