// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
	interface Locals {
		user: {
			token?: string
			userId?: string
			user?: any
		}
		isBanned?: boolean
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare namespace svelteHTML {
	// enhance elements
	interface HTMLAttributes {
		'on:loadMore'?: (event: any) => any
	}
}

declare const __VERSION__: string

declare module 'svelte-tags-input'
