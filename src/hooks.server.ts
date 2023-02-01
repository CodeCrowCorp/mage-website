import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { getUserDetails, userRole, currentUser } from '$lib/stores/authStore'
import { getUserRole, getRoles } from '$lib/stores/adminStore'
import { getRemoteConfigs, isMaintenanceModeEnabled } from '$lib/stores/remoteConfigStore'
import { Authenticate } from '$lib/authentication/authentication'
import type { Handle } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'
import {
	isChannelPage,
	userId as userIdWritable,
	token as tokenWritable
} from '$lib/stores/helperStore'

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname
	const userId = event.url.searchParams.get('userId') || event.cookies.get('userId') || ''
	userIdWritable.set(userId)
	let token = event.url.searchParams.get('token') || event.cookies.get('token') || ''
	tokenWritable.set(token)
	let user = get(currentUser),
		role = get(userRole),
		isBanned = false

	await getRemoteConfigs()
	const maintenance_mode = get(isMaintenanceModeEnabled) || false

	if (token && userId) {
		if (!user) {
			const response = await getUserDetails(token, userId)
			if (response) {
				if (response.freshJwt) {
					token = response.freshJwt
				}
				user = response
				currentUser.set(user)
			}
		}

		if (!role) {
			try {
				const headers: any = {
					userId: userId
				}
				if (env.PUBLIC_CROSS_ORIGIN === 'false') {
					headers['authorization'] = token
				} else {
					headers['x-api-key'] = env.PUBLIC_API_KEY
				}

				const all_roles = await getRoles(true, headers)
				if (Array.isArray(all_roles)) {
					const get_role = await getUserRole(true, headers)
					if (get_role && get_role.role) {
						role = all_roles.find((item) => {
							return item._id == get_role.role
						})?.name

						userRole.set(role)
					}
				}
			} catch (e) {
				console.log('something wrong', e)
			}
		}

		if (pathname === '/') {
			event.cookies.set('token', token, {
				path: '/',
				maxAge: 60 * 60 * 24 * 30
			})
			event.cookies.set('userId', userId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 30
			})
		}

		event.locals = {
			user: {
				userId,
				token,
				user
			}
		}
	}

	if (user && user.isBanned) {
		isBanned = true

		const cookieItem = ['token', 'userId']
		cookieItem.forEach((item) => {
			event.cookies.set(item, '', {
				path: '/',
				expires: new Date(0)
			})
		})

		currentUser.set(null)
		userRole.set('user')

		event.locals['isBanned'] = isBanned
	}

	if (
		Authenticate({ pathname, user_role: role || 'user' }) ||
		pathname === '/browse' ||
		pathname === '/'
	) {
		if (maintenance_mode && !['/contact', '/legal', '/maintenance'].includes(pathname) && !user) {
			if (pathname === '/maintenance') {
				return await resolve(event)
			} else {
				throw redirect(302, '/maintenance')
			}
		} else {
			console.log('pathname', pathname)
			if (pathname.includes('/channel')) {
				isChannelPage.set(false)
			} else {
				isChannelPage.set(false)
			}
			return await resolve(event)
		}
	}
	throw redirect(302, '/browse')
}

export function handleError({ error }: { error: any }) {
	console.log('error', error)
	// example integration with https://sentry.io/
	// Sentry.captureException(error, { event, errorId });
	return {
		message: 'Whoops something wrong!'
	}
}

//TODO: fix global handleFetch
// export const handleFetch: HandleFetch = async ({ request, fetch }) => {
// 	let headers: any = {}
// 	if (request.url.startsWith(env.PUBLIC_API_URL)) {
// 		if (env.PUBLIC_CROSS_ORIGIN === 'false') {
// 			headers = {
// 				authorization: request.locals.user.token,
// 				userId: request.locals.user.userId
// 			}
// 		} else {
// 			headers = {
// 				'x-api-key': env.PUBLIC_API_KEY,
// 				userId: request.locals.user.userId
// 			}
// 		}
// 	}
// 	return fetch(request, headers)
// }
