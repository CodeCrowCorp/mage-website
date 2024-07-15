import type { Actions, PageServerLoad } from './$types'
import { get, patch, putImage } from '$lib/api'
import { redirect, fail, error } from '@sveltejs/kit'

export const load = (async ({ params, url }) => {
	if (!params.username) error(404)
	const profile = await get(`user/search/username?username=${params.username.toLowerCase()}`)
	if (!profile || profile?.error) {
		error(404)
	}
	return {
		seo: {
			title: profile.displayName?.toLowerCase(),
			description: profile.bio,
			image: profile.avatar,
			imageAlt: `${profile.username?.toLowerCase()} avatar`,
			url: url.href,
			username: profile.username?.toLowerCase()
		},
		profile: profile,
		lazy: {
			channels: get(`channels/user?userId=${profile._id}&limitId=${0}&limit=${10}`),
			totalPageViews: get(`analytics/views/total-views?viewType=user&viewId=${profile._id}`),
			totalChannelViews: get(`analytics/views/total-views?viewType=channel&viewId=${profile._id}`),
			totalChannelViewsWeek: get(
				`analytics/views/total-views/7-days?viewType=channel&viewId=${profile._id}`
			),
			viewsMonthlyChange: get(
				`analytics/views/monthly-change?viewType=channel&viewId=${profile._id}`
			),
			highestStreak: get(`analytics/stream/streak/highest?userId=${profile._id}`),
			currentStreak: get(`analytics/stream/streak/current?userId=${profile._id}`),
			lastStreamAndDuration: get(`analytics/stream/last?userId=${profile._id}`),
			totalMins: get(`analytics/stream/total-mins?userId=${profile._id}`),
			totalMinsMonthlyChange: get(
				`analytics/stream/total-mins/monthly-change?userId=${profile._id}`
			),
			dailyAvgMins: get(`analytics/stream/avg-mins/daily?userId=${profile._id}`),
			isOnboarded: get(`plan/onboarded?userId=${profile._id}`),
			sponsors: get(`plan/sponsors?userId=${profile._id}`)
		}
	}
}) satisfies PageServerLoad

export const actions = {
	'update-profile': async ({ request, locals }: { request: any; locals: any }) => {
		const data: FormData = await request.formData()
		const newUser: any = {}
		addPropertyIfDefined(data, 'displayName', newUser)
		addPropertyIfDefined(data, 'username', newUser)
		addPropertyIfDefined(data, 'category', newUser)
		addPropertyIfDefined(data, 'bio', newUser)
		addPropertyIfDefined(data, 'urls', newUser, true)

		newUser.urls = newUser.urls.filter((i: string) => i)
		const avatar = data.get('avatar') as File
		const banner = data.get('banner') as File

		if (data.get('avatar') !== null && avatar.size > 0) {
			const urlLocation = await putImage(`user/current/avatar?bucketName=avatars`, avatar, {
				userId: locals.user.userId,
				token: locals.user.token
			})
			console.log(urlLocation)
		}

		if (data.get('banner') !== null && banner.size > 0) {
			const urlLocation = await putImage(`user/current/banner?bucketName=banners`, banner, {
				userId: locals.user.userId,
				token: locals.user.token
			})
			console.log(urlLocation)
		}

		const updatedUser = await patch(`user`, newUser, {
			userId: locals.user.userId,
			token: locals.user.token
		})
		if (updatedUser.exists) {
			const username = data.get('username')
			return fail(422, { username, exists: true })
		} else {
			return { success: true }
		}
	},
	onboard: async ({ locals }: { locals: any }) => {
		const { userId, token } = locals.user
		const response = await get(`plan/onboard-link`, {
			userId,
			token
		})
		redirect(303, `${response || '/'}`)
	},
	dashboard: async ({ locals }: { locals: any }) => {
		const { userId, token } = locals.user
		const response = await get(`plan/dashboard-link`, {
			userId,
			token
		})
		redirect(303, `${response || '/'}`)
	},
	sponsor: async () => {
		await new Promise<any>((resolve) => setTimeout(resolve, 1000))
	}
} satisfies Actions

const addPropertyIfDefined = (
	data: FormData,
	property: string,
	newUser: { [key: string]: any },
	list?: boolean
) => {
	const propertyValue = list ? data.getAll(property) : data.get(property)
	if (propertyValue !== null && propertyValue !== undefined) {
		newUser[property] =
			property === 'category' ? JSON.parse(propertyValue.toString()) : propertyValue
	}
}
