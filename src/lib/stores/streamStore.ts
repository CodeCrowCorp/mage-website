import { writable, type Writable } from 'svelte/store'
import { env } from '$env/dynamic/public'

export const is_sharing_screen: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_webcam: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_audio: Writable<boolean | undefined> = writable(undefined)

const updateVideoItems = (videoItems: any, liveInputs: any[]) => {
	const vidItems = [...videoItems]
	if (Array.isArray(liveInputs)) {
		vidItems.forEach((video: any) => {
			liveInputs.forEach((liveInput: any) => {
				if (video._id === liveInput._id) {
					switch (liveInput.trackType) {
						case 'screen':
							// isTrackActive required for real-time dismissal
							video.screen = liveInput.isTrackActive ? liveInput : null
							break
						case 'webcam':
							video.webcam = liveInput.isTrackActive ? liveInput : null
							break
						case 'audio':
							video.audio = liveInput.isTrackActive ? liveInput : null
							break
					}
				}
			})
		})
	}
	return vidItems
}

async function createStreamRecord(stream: any) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/stream`, {
		method: 'POST',
		body: stream
	})
}

async function updateProfileViews(view: any) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/profile/views/week`, {
		method: 'POST',
		body: view
	})
}

async function getProfileWeeklyViews(profile: any) {
	return await fetch(
		`${env.PUBLIC_API_URL}/stats/profile/views?id=${profile.id}&profileType=${profile.type}`,
		{
			method: 'GET'
		}
	)
}

async function updateTwitterShareCount(channelId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/channel/shared?channelId=${channelId}`, {
		method: 'PUT'
	})
}

async function getTwitterShareCount(channelId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/channel/shared?channelId=${channelId}`, {
		method: 'GET'
	})
}

async function getStreamStreak(userId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/stream/streak?userId=${userId}`, {
		method: 'GET'
	})
}

async function getStreamAvgLength(userId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/stream/avg-length?userId=${userId}`, {
		method: 'GET'
	})
}

async function getStreamTotalHours(userId: string) {
	return await fetch(`${env.PUBLIC_API_URL}/stats/stream/total-hours?userId=${userId}`, {
		method: 'GET'
	})
}

export {
	updateVideoItems,
	createStreamRecord,
	updateProfileViews,
	getProfileWeeklyViews,
	updateTwitterShareCount,
	getTwitterShareCount,
	getStreamTotalHours,
	getStreamAvgLength,
	getStreamStreak
}
