import { redirect, type Handle } from '@sveltejs/kit'
import { get as getWritableVal } from 'svelte/store'
import { Authenticate } from '$lib/authentication/authentication'
import { get } from '$lib/api'
import { user_role } from '$lib/stores/userStore'
import { env } from '$env/dynamic/public'

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname
	const userId = event.url.searchParams.get('userId') || event.cookies.get('userId') || ''
	let token = event.url.searchParams.get('token') || event.cookies.get('token') || ''

	//TODO: get and save params from twitchAuthCallback
	//TODO: get and save params from youTubeAuthCallback

	let user: any = event.locals.user?.user || ''
	const role = getWritableVal(user_role)
	const maintenanceMode: boolean = env.PUBLIC_MAINTENANCE_MODE === 'true'

	if (token && userId) {
		if (!user) {
			const response = await get('auth/me', { userId, token })
			if (response) {
				if (response.freshJwt) {
					token = response.freshJwt
				}
				user = response.user
			}
		} else {
			if (user.isBanned) {
				const cookieItem = ['token', 'userId', 'user']
				cookieItem.forEach((item) => {
					event.cookies.set(item, '', {
						path: '/',
						expires: new Date(0)
					})
				})
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
		//TODO: if need to update platform object, visit app.d.ts file
		event.locals = {
			user: {
				userId,
				token,
				user
			},
			platform: {
				twitch: { isConnected: false },
				youtube: { isConnected: false }
			}
		}
	}

	if (Authenticate({ pathname, user_role: role || 'user' })) {
		if (maintenanceMode) {
			if (pathname === '/maintenance') {
				return await resolve(event)
			} else {
				redirect(302, '/maintenance')
			}
		} else {
			if (
				pathname === '/maintenance' ||
				(pathname === '/premium' && env.PUBLIC_FEATURE_PREMIUM === 'false')
			) {
				redirect(302, '/browse')
			} else {
				return await resolve(event)
			}
		}
	} else {
		return await resolve(event)
	}
	return await resolve(event)
}

export const handleError = ({ error }: { error: any }) => {
	console.log('error', error)
	// example integration with https://sentry.io/
	// Sentry.captureException(error, { event, errorId });
	return {
		message: 'Whoops something went wrong!'
	}
}
