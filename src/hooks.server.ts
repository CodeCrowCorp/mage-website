import { redirect, type Handle } from '@sveltejs/kit'
import { get as getWritableVal } from 'svelte/store'
import {
	is_maintenance_mode_enabled,
	is_feature_video_responses_enabled,
	is_feature_group_chat_enabled,
	is_feature_mint_page_enabled,
	is_feature_premium_page_enabled
} from '$lib/stores/remoteConfigStore'
import { Authenticate } from '$lib/authentication/authentication'
import { get } from '$lib/api'
import { user_role } from '$lib/stores/authStore'
import { hasOneHourPassed } from '$lib/utils'

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname

	const userId = event.url.searchParams.get('userId') || event.cookies.get('userId') || ''
	let token = event.url.searchParams.get('token') || event.cookies.get('token') || ''
	const lastTimeTillLoadConfig = event.cookies.get('loadConfigTime') || '0'

	let user: any = event.locals.user?.user || ''
	const role = getWritableVal(user_role)
	let maintenance_mode
	if (hasOneHourPassed(+lastTimeTillLoadConfig)) {
		const remoteConfigs = await get('remote-configs', { userId, token })
		event.cookies.set('loadConfigTime', Date.now().toString(), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		})
		if (remoteConfigs && remoteConfigs.length) {
			remoteConfigs.map((config: { flagKey: string; flagValue: boolean }) => {
				if (config.flagKey === 'maintenance-mode') {
					is_maintenance_mode_enabled.set(config.flagValue)
					maintenance_mode = config.flagValue
				}
				if (config.flagKey === 'feature-video-responses')
					is_feature_video_responses_enabled.set(config.flagValue)
				if (config.flagKey === 'feature-group-chat')
					is_feature_group_chat_enabled.set(config.flagValue)
				if (config.flagKey === 'feature-mint-page')
					is_feature_mint_page_enabled.set(config.flagValue)
				if (config.flagKey === 'feature-premium-page')
					is_feature_premium_page_enabled.set(config.flagValue)
			})
		}
	}

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

		if (!role) {
			const allRoles = await get('roles', { userId, token })
			if (Array.isArray(allRoles)) {
				const userRole = await get('roles/role-mapping', { userId, token })
				if (userRole && userRole.role) {
					const usersRoleName = allRoles.find((item) => {
						return item._id == userRole.role
					})?.name

					user_role.set(usersRoleName)
				}
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
			return await resolve(event)
		}
	}
	throw redirect(302, '/browse')
}

export const handleError = ({ error }: { error: any }) => {
	console.log('error', error)
	// example integration with https://sentry.io/
	// Sentry.captureException(error, { event, errorId });
	return {
		message: 'Whoops something went wrong!'
	}
}
