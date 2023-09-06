import type { Actions, PageServerLoad } from './$types'
import { get, patch, post, putImage } from '$lib/api'
import { redirect, fail, error } from '@sveltejs/kit'

export const load = (async ({ params, locals }: { params: any; locals: any }) => {
	const profile = await get(`users/search/username?username=${params.username}`)
	if (profile.error) {
		throw error(404)
	}
	return {
		profile: profile,
		lazy: {
			profileViews: post(
				`stats/profile/views`,
				{
					type: 'view',
					userid: locals.user.userId,
					profileType: 'user',
					profileId: profile._id
				},
				{
					userId: locals.user.userId,
					token: locals.user.token
				}
			),
			channels: get(`channels/user?userId=${profile._id}&skip=${0}&limit=${10}`),
			totalPageViews: get(`stats/profile/views/four-weeks?profileType=user&id=${profile._id}`),
			viewsMonthlyIncr: get(`stats/profile/views/monthly?profileType=user&id=${profile._id}`),
			highestAndCurrentStreak: get(`stats/stream/streak?userId=${profile._id}`),
			streakMonthlyIncr: get(`stats/stream/streak/monthly?userId=${profile._id}`),
			totalHours: get(`stats/stream/total-hours?userId=${profile._id}`),
			totalHoursMonthlyIncr: get(`stats/stream/total-hours/monthly?userId=${profile._id}`),
			avgHours: get(`stats/stream/avg-length?userId=${profile._id}`),
			avgHoursMonthlyIncr: get(`stats/stream/total-hours?userId=${profile._id}`)
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
				`users/current/avatar?bucketName=avatars`,
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
				`users/current/banner?bucketName=banners`,
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
				throw redirect(303, `/${updatedUser.username}`)
			} else {
				throw redirect(303, 'browse')
			}
		}
	},
	sponsor: async () => {
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
