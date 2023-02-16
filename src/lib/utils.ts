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
