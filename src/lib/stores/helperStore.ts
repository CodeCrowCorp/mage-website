import { writable, type Writable } from 'svelte/store'

export const is_login_modal_open: Writable<any> = writable(null)
export const current_theme: Writable<string> = writable('dark')
