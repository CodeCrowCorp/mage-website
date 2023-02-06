import { env } from '$env/dynamic/public'
import { writable, type Writable } from 'svelte/store'

export const current_user: Writable<any> = writable(null)

export const user_role: Writable<any> = writable(null)
