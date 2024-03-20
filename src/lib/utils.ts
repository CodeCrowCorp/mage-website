import { browser } from '$app/environment'

export const levelAndBarValueFromExp = (
	currentExp: number
): { level: number; barValue: number } => {
	if (currentExp == 0) {
		return { level: 1, barValue: 0 }
	}
	const equate = (xp: number) => {
		return Math.floor(xp + 300 * Math.pow(2, xp / 7))
	}

	const level_to_xp = (level: number) => {
		let xp = 0
		for (let i = 1; i <= level; i++) xp += equate(i)
		return Math.floor(xp / 4)
	}

	const xp_to_level = (xp: number) => {
		let level = 1
		while (level_to_xp(level) <= xp) level++
		return level
	}

	const level = xp_to_level(currentExp),
		currentLevelMaxExp = level_to_xp(level),
		prevLevelMaxExp = level_to_xp(level - 1),
		expDiff = currentLevelMaxExp - prevLevelMaxExp,
		remainingLevelExp = currentLevelMaxExp - currentExp,
		barValue = Math.abs(100 - (remainingLevelExp / expDiff) * 100)

	return { level, barValue }
}

export const colorFromLevel = (level: number): string => {
	const hue = (360 * (level * 0.6180339887498949)) % 360
	return hslToHex(hue, 100, 50)

	// return `hsl(${hue}, 100%, 50%)`
}

const hslToHex = (h: number, s: number, l: number): string => {
	l /= 100
	const a = (s * Math.min(l, 1 - l)) / 100
	const f = (n: number) => {
		const k = (n + h / 30) % 12
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0') // convert to Hex and prefix "0" if needed
	}
	return `#${f(0)}${f(8)}${f(4)}`
}

export const isJsonString = (str: string): boolean => {
	try {
		JSON.parse(str)
	} catch (err) {
		return false
	}
	return true
}

export const getSectionUrl = ({
	sectionId,
	query,
	lastId,
	limit
}: {
	sectionId: string
	query: string
	lastId: number
	limit: number
}): string => {
	switch (sectionId) {
		case 'most-active':
			return `channels/most-active?lastId=${lastId}&limit=${limit}`
		case 'weekly':
			return `channels/weekly?searchQuery=${query}&lastId=${lastId}&limit=${limit}`
		case 'highest-ranked':
			return `users/highest-ranked?searchQuery=${query}&lastId=${lastId}&limit=${limit}`
		case 'rising-stars':
			//analytics/stream/getRisingStars?lastId=${0}&limit=${10}
			//users/rising-stars?searchQuery=${query}&lastId=${lastId}&limit=${limit}
			return `analytics/stream/rising-stars?lastId=${lastId}&limit=${limit}`
		case 'my':
			return `channels/user?searchQuery=${query}&lastId=${lastId}&limit=${limit}`
		case 'fav':
			return `channels/me/fav?searchQuery=${query}&lastId=${lastId}&limit=${limit}`
		default:
			return `channels?searchQuery=${query}&lastId=${lastId}&limit=${limit}`
	}
}

export const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text)
		console.log('Text copied to clipboard')
	} catch (err) {
		console.error('Error copying text to clipboard:', err)
	}
}

export const setRole = ({
	userId,
	channel,
	currentUserId
}: {
	userId: any
	channel: any
	currentUserId: string
}): any => {
	if (userId === 'AI') return '🤖 AI'
	else if (userId === channel?.userId) return 'Host'
	else if (channel?.mods?.includes(userId)) return 'Mod'
	else if (userId === currentUserId) return 'You'
	else return 'Rando'
}

export const getColoredRole = (role: string) =>
	({
		'🤖 AI': {
			tagColor: 'bg-transparent bg-clip bg-gradient-to-r to-emerald-600 from-sky-400',
			textColor: 'text-accent'
		},
		Host: { tagColor: 'bg-pink-600', textColor: 'text-pink-500' },
		Mod: { tagColor: 'bg-green-700', textColor: 'text-green-600' },
		You: { tagColor: 'bg-gray-600' },
		Rando: { textColor: 'text-info' }
	})[role] || {}

/*
Input: 33, 16
Output: [16, 16, 1]

Input: 20, 16
Output: [16, 4]
*/
export const divideNumber = (number: number, divider: number): number[] => {
	if (number <= divider) {
		return [number]
	}
	const quotient = Math.floor(number / divider)
	return [divider].concat(quotient > 0 ? divideNumber(number - divider, divider) : [])
}

export const cardCounts: { [key: number]: number[] } = {
	1: [1],
	2: [2],
	3: [2, 1],
	4: [2, 2],
	5: [2, 2, 1],
	6: [3, 3],
	7: [3, 2, 2],
	8: [3, 3, 2],
	9: [3, 3, 3],
	10: [4, 3, 3],
	11: [4, 4, 3],
	12: [4, 4, 4],
	13: [4, 4, 4, 1],
	14: [4, 4, 3, 3],
	15: [4, 4, 4, 3],
	16: [4, 4, 4, 4]
}

export const timeSince = (date: string) => {
	if (!date) return 'Date created unknown'
	const created: any = new Date(date)
	const currentDate: any = new Date(Date.now())
	const seconds = Math.floor((currentDate - created) / 1000)
	let interval = seconds / 31536000
	if (interval > 1) {
		return Math.floor(interval) + ' years ago'
	}
	interval = seconds / 2592000
	if (interval > 1) {
		return Math.floor(interval) + ' months ago'
	}
	interval = seconds / 86400
	if (interval > 1) {
		return Math.floor(interval) + ' days ago'
	}
	interval = seconds / 3600
	if (interval > 1) {
		return Math.floor(interval) + ' hours ago'
	}
	interval = seconds / 60
	if (interval > 1) {
		return Math.floor(interval) + ' minutes ago'
	}
	return Math.floor(seconds) + ' seconds ago'
}

export const getVideoGrids = (list: any, limit: number) => {
	if (!list.length) return []

	const numList = divideNumber(list.length, limit)
	const result: any[] = []
	let pointer = 0

	for (let i = 0; i < numList.length; i++) {
		const row: any = cardCounts[numList[i]]
		for (let j = 0; j < row.length; j++) {
			result[j] = []
			for (let k = 0; k < row[j]; k++) {
				if (pointer < list.length) {
					result[j].push({ ...list[pointer] })
					pointer++
				}
			}
		}
	}

	return result
}

export const getAudioIndicator = (
	stream: MediaStream,
	eventDispatcher: { dispatchEvent: (arg0: CustomEvent<number>) => void }
) => {
	const audioContext = new AudioContext()
	const analyser = audioContext.createAnalyser()
	const microphone = audioContext.createMediaStreamSource(stream)
	const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

	// Connect nodes
	analyser.smoothingTimeConstant = 0.8
	analyser.fftSize = 1024

	microphone.connect(analyser)
	analyser.connect(javascriptNode)
	javascriptNode.connect(audioContext.destination)

	// Create audio indicator
	javascriptNode.onaudioprocess = () => {
		const array = new Uint8Array(analyser.frequencyBinCount)
		analyser.getByteFrequencyData(array)
		let values = 0

		const length = array.length
		for (let i = 0; i < length; i++) {
			values += array[i]
		}

		const average = values / length

		// Visualize the audio indicator, e.g. through console or manipulating the DOM
		// console.log(average)

		eventDispatcher.dispatchEvent(new CustomEvent('localAudioSpeakingValue', { detail: average }))
	}
}

/** Dispatch event on click outside of node */

export const clickOutside = (element: any, callbackFunction: any) => {
	const onClick = (event: any) => {
		if (!element.contains(event.target)) {
			callbackFunction(event)
		}
	}

	document.body.addEventListener('click', onClick)

	return {
		update(newCallbackFunction: any) {
			callbackFunction = newCallbackFunction
		},
		destroy() {
			document.body.removeEventListener('click', onClick)
		}
	}
}

export const createEffect = (...initialDeps: any[]) => {
	let diff = JSON.stringify(initialDeps)
	return (callback: () => void, deps?: any[], allowServerSide = false) => {
		if (JSON.stringify(deps) !== diff && ((!allowServerSide && browser) || allowServerSide)) {
			diff = JSON.stringify(deps)
			callback()
		} else if (!deps) {
			diff = ''
		}
	}
}

export const getWeekNumber = (date: Date) => {
	const now = date
	const onejan = new Date(now.getFullYear(), 0, 1)
	return Math.ceil(((now.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
}

export const getNumberInThousands = (number: number) => {
	if (number >= 1000000000) {
		return Math.floor(number / 1000000000) + 'b'
	} else if (number >= 1000000) {
		return Math.floor(number / 1000000) + 'm'
	} else if (number >= 1000) {
		return Math.floor(number / 1000) + 'k'
	} else {
		return number.toString()
	}
}

export const captureScreenShot = (channel: any) => {
	const screenElement = document.getElementById(
		`screen-${channel.videoItems[0]._id}`
	) as HTMLVideoElement
	const webcamElement = document.getElementById(
		`webcam-${channel.videoItems[0]._id}`
	) as HTMLVideoElement
	const canvas = document.createElement('canvas')
	canvas.width = screenElement?.videoWidth || 1920
	canvas.height = screenElement?.videoHeight || 1080

	const ctx = canvas.getContext('2d')

	console.log(screenElement)
	console.log(webcamElement)

	if (ctx !== null && screenElement !== null && webcamElement !== null) {
		ctx.drawImage(screenElement, 0, 0, canvas.width, canvas.height)
		ctx.globalAlpha = 1
		ctx.drawImage(webcamElement, 1400, 750, canvas.width - 1400, canvas.height - 750)
	}

	return canvas.toDataURL('image/jpeg')
	//thumbnailRef.setAttribute('src', screenshot);
}

export const dataURLtoFile = (dataurl: string, filename: string) => {
	const arr = dataurl.split(',')
	const mime = (arr[0] && arr[0].match(/:(.*?);/)?.[1]) || ''
	const bstr = atob(arr[1])
	let n = bstr.length
	const u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], filename, { type: mime })
}

export const objectMonitor = (object: any) => {
	return (currentState: any) => {
		return JSON.stringify(object) !== JSON.stringify(currentState)
	}
}

export const isValidRtmp = (url: string) => {
	const pattern = new RegExp(
		'^(rtmps?:\\/\\/|rtmp?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)*[a-z\\d]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', // fragment locator
		'i'
	)
	return pattern.test(url)
}

export const isValidUrl = (url: string) => {
	const pattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[\\@-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', // fragment locator
		'i'
	)
	return pattern.test(url)
}

export const getHref = async ({
	provider,
	apiUrl,
	xApiKey
}: {
	provider: string
	apiUrl: string
	xApiKey: string
}) => {
	const response = await fetch(`${apiUrl}/auth/${provider}`, {
		headers: {
			Accept: '*/*',
			'x-api-key': xApiKey
		}
	})
	const { loginUrl } = await response.json()
	window.location.replace(loginUrl)
}

export const formatTime = (streamTime: number) => {
	const hours = Math.floor(streamTime / 3600)
	const minutes = Math.floor((streamTime % 3600) / 60)
	const seconds = streamTime % 60

	const paddedHours = hours.toString().padStart(2, '0')
	const paddedMinutes = minutes.toString().padStart(2, '0')
	const paddedSeconds = seconds.toString().padStart(2, '0')

	return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
}

export const updateVideoItems = (videoItems: any, liveInputs: any[]) => {
	const vidItems = [...videoItems]
	const liveInputsMap = new Map()
	if (Array.isArray(liveInputs)) {
		liveInputs.forEach((liveInput: any) => {
			liveInputsMap.set(liveInput._id, liveInput)
		})
		vidItems.forEach((video: any) => {
			const liveInput = liveInputsMap.get(video._id)
			if (liveInput) {
				switch (liveInput.trackType) {
					case 'rtmps':
						video.rtmps = liveInput
						break
					case 'screen':
						video.screen = liveInput
						break
					case 'webcam':
						video.webcam = liveInput
						break
					case 'audio':
						video.audio = liveInput
						break
				}
			}
		})
	}
	return vidItems
}
