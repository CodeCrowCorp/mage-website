var aliveScreens:any = {}

export const addScreen = (url:string, screen:any) => {
    aliveScreens[url] = screen
}

export const getScreen = (url:string):any => {
    return aliveScreens[url]
}

export const removeScreen = (url:string) => {
    delete aliveScreens[url]
}