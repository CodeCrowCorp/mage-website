// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
	interface Locals {
		user: {
			token?: string
			userId?: string
			user?: object
		}
		isBanned?: boolean
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare const __VERSION__: string
