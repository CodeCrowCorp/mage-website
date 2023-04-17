import { writable, type Writable } from 'svelte/store'

export const platform_connection: Writable<string> = writable()
export const channel_connection: Writable<string> = writable()
export const platform_message: Writable<string> = writable()
export const channel_message: Writable<string> = writable()
