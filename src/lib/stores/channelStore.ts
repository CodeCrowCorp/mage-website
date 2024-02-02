import { writable, type Writable } from 'svelte/store'

export const category_list: Writable<any> = writable({})
export const tags: Writable<any> = writable([])
export const category_assets: Writable<any> = writable({ game: {}, dev: {} })
export const is_chat_drawer_open: Writable<boolean> = writable(false)
export const is_chat_drawer_destroy: Writable<boolean> = writable(false)
export const was_chat_drawer_closed: Writable<boolean> = writable(false)

export const is_restream_drawer_open: Writable<boolean> = writable(false)

export const streamViewerCountStore = writable({
	viewerCount: 0,
	youtube: 0,
	twitch: 0
})

const hasLocalStorage = typeof localStorage !== 'undefined'

const storedStream = hasLocalStorage
	? JSON.parse(localStorage?.getItem('streamData') || 'null')
	: {
			url: '',
			streamKey: '',
			type: 'youtube',
			redirected: false
	  }

export const streamStore = writable(storedStream)

// Subscribe to changes in streamStore
streamStore.subscribe((streamData) => {
	// Update localStorage when streamData changes
	if (hasLocalStorage) {
		localStorage.setItem('streamData', JSON.stringify(streamData))
	}
})
