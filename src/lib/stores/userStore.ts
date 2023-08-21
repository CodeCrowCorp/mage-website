import { writable, type Writable } from 'svelte/store'

export const user_role: Writable<any> = writable(null)
export const isOnline: Writable<boolean> = writable(false)
