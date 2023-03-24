export const levelAndBarValueFromExp = (
	currentExp: number
): { level: number; barValue: number } => {
	const level = Math.floor(0.5 * Math.sqrt(currentExp)) + 1
	const currentLevelExp = Math.pow(level - 1, 2) * 100
	const nextLevelExp = Math.pow(level, 2) * 100
	const expDifference = nextLevelExp - currentLevelExp
	const expProgress = (currentExp - currentLevelExp) / expDifference
	const barValue = Math.round(expProgress * 100)

	return { level, barValue }
}

export const colorFromLevel = (level: number): string => {
	const hue = (360 * (level * 0.6180339887498949)) % 360
	return `hsl(${hue}, 100%, 50%)`
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
		case 'weekly':
			return `channels/weekly?searchQuery=${query}&skip=${skip}&limit=${limit}`
		case 'highest-ranked':
			return `users/highest-ranked?searchQuery=${query}&skip=${skip}&limit=${limit}`
		case 'rising-stars':
			return `users/rising-stars?searchQuery=${query}&skip=${skip}&limit=${limit}`
		case 'my':
			return `channels/me/hosted?searchQuery=${query}&skip=${skip}&limit=${limit}`
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

export const hasOneHourPassed = (date: number) => {
	const hour = 1000 * 60 * 60
	const hourago = Date.now() - hour
	return hourago > date
}

export const getColoredRole = (role: string) => {
	switch (role) {
		case 'Host':
			return {
				tagColor: 'bg-secondary',
				textColor: 'text-pink-500'
			}
		case 'You':
			return {
				tagColor: 'bg-gray-600'
			}
		case 'Mod':
			return {
				tagColor: 'bg-green-700',
				textColor: 'text-success'
			}
		case 'Rando':
			return {
				textColor: 'text-info'
			}
	}
}

/*
Input: 33, 16
Output: [16, 16, 1]

Input: 20, 16
Output: [16, 4]
*/
export const divideNumber = (number: number, divider: number): number[] => {
	if (number < divider) {
		return [number]
	}
	const quotient = Math.floor(number / divider)
	return [divider].concat(quotient > 0 ? divideNumber(number - divider, divider) : [])
}

export const cardCounts: { [key: number]: number[] } = {
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
