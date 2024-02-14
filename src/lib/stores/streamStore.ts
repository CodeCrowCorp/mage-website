import { writable, type Writable } from 'svelte/store'

export const is_sharing_rtmps: Writable<boolean | undefined> = writable(false)
export const is_sharing_screen: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_webcam: Writable<boolean | undefined> = writable(undefined)
export const is_sharing_audio: Writable<boolean | undefined> = writable(undefined)
