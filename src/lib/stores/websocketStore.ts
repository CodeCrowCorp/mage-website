import { writable, type Writable } from 'svelte/store'

export const platformConnection: Writable<string> = writable()
export const channelConnection: Writable<string> = writable()
export const platformMessage: Writable<MessageEvent> = writable()
export const channelMessage: Writable<MessageEvent> = writable()
