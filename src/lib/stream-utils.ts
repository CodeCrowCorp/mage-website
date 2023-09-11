const aliveScreens: any = {}

export const addScreen = (key: string, screen: any) => {
	aliveScreens[key] = screen
}

export const getScreen = (key: string): any => {
	return aliveScreens[key]
}

export const removeScreen = (key: string) => {
	delete aliveScreens[key]
}
