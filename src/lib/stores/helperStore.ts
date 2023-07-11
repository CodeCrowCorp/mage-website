import { writable, type Writable } from 'svelte/store'

const profiles: any = {}

export const is_login_modal_open: Writable<any> = writable(null)
export const current_theme: Writable<string> = writable('dark')

export const setProfile = (id: string, profile: any) => {
	profiles[id] = profile
}

export const getProfile = (id: string) => {
	return profiles[id]
}
