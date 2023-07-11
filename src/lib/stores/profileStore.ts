import { writable, type Writable } from 'svelte/store'

export const follower_count: Writable<number> = writable(0)
export const following_count: Writable<number> = writable(0)
