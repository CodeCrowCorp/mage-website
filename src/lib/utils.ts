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
