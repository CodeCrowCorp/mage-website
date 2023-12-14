import { writable, type Writable } from 'svelte/store'

export const is_wip_webrtc: Writable<boolean | undefined> = writable(true)

export const is_sharing_rtmp: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_webrtc: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_webcam: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_audio: Writable<boolean | undefined> = writable(undefined)

const updateVideoItems = (videoItems: any, liveInputs: any[]) => {
	const vidItems = [...videoItems]
	if (Array.isArray(liveInputs)) {
		vidItems.forEach((video: any) => {
			liveInputs.forEach((liveInput: any) => {
				if (video._id === liveInput._id) {
					switch (liveInput.trackType) {
						case 'rtmp':
							video.rtmps = liveInput.isConnected ? liveInput : null
							break
						case 'webrtc':
							// isConnected required for real-time dismissal
							video.webrtc = liveInput.isConnected ? liveInput : null
							break
					}
				}
			})
		})
	}
	return vidItems
}

export { updateVideoItems }
