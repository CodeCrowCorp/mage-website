import { writable, type Writable } from 'svelte/store'

export const is_sharing_rtmps: Writable<boolean | undefined> = writable(false)
export const is_sharing_screen: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_webcam: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_audio: Writable<boolean | undefined> = writable(undefined)

const updateVideoItems = (videoItems: any, liveInputs: any[]) => {
	const vidItems = [...videoItems]
	if (Array.isArray(liveInputs)) {
		vidItems.forEach((video: any) => {
			liveInputs.forEach((liveInput: any) => {
				if (video._id === liveInput._id) {
					video = Object.assign(video, liveInput)
					console.log('got here----video', JSON.stringify(video.webRTC))
				}
			})
		})
	}
	return vidItems
}

export { updateVideoItems }
