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
	skip,
	limit
}: {
	sectionId: string
	query: string
	skip: number
	limit: number
}): string => {
	switch (sectionId) {
		case 'most-active':
			return `channels/most-active?skip=${skip}&limit=${limit}`
		case 'weekly':
			return `channels/weekly?searchQuery=${query}&skip=${skip}&limit=${limit}`
		case 'highest-ranked':
			return `users/highest-ranked?searchQuery=${query}&skip=${skip}&limit=${limit}`
		case 'rising-stars':
			//stats/stream/getRisingStars?skip=${0}&limit=${10}
			//users/rising-stars?searchQuery=${query}&skip=${skip}&limit=${limit}
			return `stats/stream/rising-stars?skip=${skip}&limit=${limit}`
		case 'my':
			return `channels/user?searchQuery=${query}&skip=${skip}&limit=${limit}`
		case 'fav':
			return `channels/me/fav?searchQuery=${query}&skip=${skip}&limit=${limit}`
		default:
			return `channels?searchQuery=${query}&skip=${skip}&limit=${limit}`
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
	else if (userId === channel?.user) return 'Host'
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
		Host: { tagColor: 'bg-secondary', textColor: 'text-pink-500' },
		Mod: { tagColor: 'bg-green-700', textColor: 'text-success' },
		You: { tagColor: 'bg-gray-600' },
		Rando: { textColor: 'text-info' }
	}[role] || {})

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
			callbackFunction(event);
		}
	}
	
	document.body.addEventListener('click', onClick);
	
	return {
		update(newCallbackFunction: any) {
			callbackFunction = newCallbackFunction;
		},
		destroy() {
			document.body.removeEventListener('click', onClick);
		}
	}
}
