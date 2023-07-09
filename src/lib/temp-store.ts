var profiles: any = {}

export const setProfile = (id:string, profile:any) => {
    profiles[id] = profile
}

export const getProfile = (id:string) => {
    return profiles[id]
}