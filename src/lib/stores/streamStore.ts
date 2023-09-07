import { writable, type Writable } from 'svelte/store'

export const is_sharing_obs: Writable<boolean | undefined> = writable(undefined)
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
						case 'obs':
							video.obs = liveInput.isTrackActive ? liveInput : null
							break
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

export { updateVideoItems }
