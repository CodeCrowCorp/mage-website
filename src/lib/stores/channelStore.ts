import { writable, type Writable } from 'svelte/store'

export const category_list: Writable<any> = writable({})
export const tags: Writable<any> = writable([])
export const category_assets: Writable<{
	web2: object
	web3: object
	game: object
}> = writable({ web2: {}, web3: {}, game: {} })
export const is_chat_drawer_open: Writable<boolean> = writable(false)
export const is_chat_drawer_destroy: Writable<boolean> = writable(false)
export const was_chat_drawer_closed: Writable<boolean> = writable(false)

export const is_restream_drawer_open: Writable<boolean> = writable(false)
export const is_restream_drawer_destroy: Writable<boolean> = writable(false)
export const was_restream_drawer_closed: Writable<boolean> = writable(false)
