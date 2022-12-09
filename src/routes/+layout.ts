//import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async() => {
    return {
        //...await redirect(302, '/login')
    }
}
