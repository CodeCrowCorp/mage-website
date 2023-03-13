import { writable, type Writable } from 'svelte/store'

export const subscriber_count: Writable<number> = writable(0)
export const interest_count: Writable<number> = writable(0)
