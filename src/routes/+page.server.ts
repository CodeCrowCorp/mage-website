import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }: { locals: any }) {
	if (!locals.user || locals.user) {
		throw redirect(307, '/browse')
	}
}
