import type { Actions, PageServerLoad } from './$types'
import { get, patch, put, del, putImage } from '$lib/api'
import { redirect, fail } from '@sveltejs/kit'

export const load = (async ({ params, locals }) => {
	const profile = await get(`users/search/username?username=${params.username}`)
	return {
		profile: profile,
		lazy: {
			channels: get(`channels/user?userId=${profile._id}&skip=${0}&limit=${10}`),
			subscribers: get(
				`subscribes?source=${profile._id}&sourceType=source1&skip=${0}&limit=${10}`,
				{ userId: locals.user?.userId, token: locals.user?.token }
			),
			interests: get(`subscribes?source=${profile._id}&sourceType=source2&skip=${0}&limit=${10}`, {
				userId: locals.user?.userId,
				token: locals.user?.token
			}),
			subscriberCount: get(`subscribes/count?source=${profile._id}&sourceType=source1`),
			interestCount: get(`subscribes/count?source=${profile._id}&sourceType=source2`),
			isSubscribed: get(`subscribes/relationship?source=${profile._id}`, {
				userId: locals.user?.userId,
				token: locals.user?.token
			}),
			totalPageViews: get(`stats`),
			highestAndCurrentStreak: get(`stats`),
			totalAndAvgHours: get(`stats`)
		}
	}
}) satisfies PageServerLoad

export const actions = {
	'update-profile': async ({ request, locals }: { request: any; locals: any }) => {
		const data: FormData = await request.formData()
		const newUser: any = {}
		addPropertyIfDefined(data, 'displayName', newUser)
		addPropertyIfDefined(data, 'username', newUser)
		addPropertyIfDefined(data, 'website', newUser)
		addPropertyIfDefined(data, 'category', newUser)
		addPropertyIfDefined(data, 'bio', newUser)

		const avatar = data.get('avatar') as File

		const banner = data.get('banner') as File

		if (data.get('avatar') !== null && avatar.size > 0) {
			const urlLocation = await putImage(
				`users/current/avatar?bucketName=avatars&originalName=${locals.user.userId}-avatar`,
				data.get('avatar'),
				{
					userId: locals.user.userId,
					token: locals.user.token
				}
			)
			console.log(urlLocation)
		}

		if (data.get('banner') !== null && banner.size > 0) {
			const urlLocation = await putImage(
				`users/current/banner?bucketName=banners&originalName=${locals.user.userId}-banner`,
				data.get('banner'),
				{
					userId: locals.user.userId,
					token: locals.user.token
				}
			)
			console.log(urlLocation)
		}

		const updatedUser = await patch(`users`, newUser, {
			userId: locals.user.userId,
			token: locals.user.token
		})
		if (updatedUser.exists) {
			const username = data.get('username')
			return fail(422, { username, exists: true })
		} else {
			if (updatedUser._id) {
				locals.user.user = updatedUser
				throw redirect(303, `/profile/${updatedUser.username}`)
			} else {
				throw redirect(303, 'browse')
			}
		}
	},
	subscribe: async ({ request, locals }: { request: any; locals: any }) => {
		const data = await request.formData()
		const isSubscribing = data.get('isSubscribing')
		const source1 = data.get('source1')
		const source2 = data.get('source2')
		if (isSubscribing === 'true') {
			await put(
				`subscribes`,
				{ source1, source2 },
				{
					userId: locals.user?.userId,
					token: locals.user?.token
				}
			)
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
