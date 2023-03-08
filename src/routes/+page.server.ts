import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = (({ locals }: { locals: any }) => {
	if (!locals.user || locals.user) {
		throw redirect(307, '/browse')
	}
}) satisfies LayoutServerLoad
