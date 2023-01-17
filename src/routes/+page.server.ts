import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals, params }: { locals: any }) {
	if (!locals.user || !params.slug) {
		throw redirect(307, '/browse')
	}
}
