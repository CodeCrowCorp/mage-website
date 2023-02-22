import { writable, type Writable } from 'svelte/store'

export const platformConnection: Writable<string> = writable()
export const channelConnection: Writable<string> = writable()
export const platformMessage: Writable<string> = writable()
export const channelMessage: Writable<string> = writable()
export const chatHistory: Writable<any> = writable([])
