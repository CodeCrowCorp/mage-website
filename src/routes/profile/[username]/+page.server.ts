import type { Actions, PageServerLoad } from './$types'
import { get, patch, put, del } from '$lib/api'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ params, locals }) => {
	const profile = await get(`users/search/username?username=${params.username}`)


	return {
		profile: profile,
		lazy: {
			channels: await get(`channels/user?userId=${profile._id}&skip=${0}&limit=${10}`),
			subscribers: await get(
				`subscribes?source=${profile._id}&sourceType=source1&skip=${0}&limit=${10}`,
				{ userId: locals.user?.userId, token: locals.user?.token }
			),
			interests: await get(`subscribes?source=${profile._id}&sourceType=source2&skip=${0}&limit=${10}`, {
				userId: locals.user?.userId,
				token: locals.user?.token
			}),
			subscriberCount: await get(`subscribes/count?source=${profile._id}&sourceType=source1`),
			interestCount: await get(`subscribes/count?source=${profile._id}&sourceType=source2`),
			isSubscribed: await get(`subscribes/relationship?source=${profile._id}`, {
				userId: locals.user?.userId,
				token: locals.user?.token
			})
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
	},
	subscribe: async ({ request, locals }: { request: any; locals: any }) => {
		const data = await request.formData()
		const isSubscribing = data.get('isSubscribing')
		console.log(data)
		const source1 = data.get('source1')
		const source2 = data.get('source2')
		if (isSubscribing=='false') {
			console.log('its not')

			const sub = await put(
				`subscribes?source1=${source1}&source2=${source2}`,
				{},
				{
					userId: locals.user?.userId,
					token: locals.user?.token
				}
			)
			console.log(sub)
		} else {
			await del(`subscribes?source1=${source1}&source2=${source2}`, {
				userId: locals.user?.userId,
				token: locals.user?.token
			})
		}
	},
	sponsor: async ({ request, locals }: { request: any; locals: any }) => {
		await new Promise<any>((resolve) => setTimeout(resolve, 1000))
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
