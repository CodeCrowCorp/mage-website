import { writable, type Writable } from 'svelte/store'
import { env } from '$env/dynamic/public'

export const login_modal: Writable<any> = writable(null)

export const getHeaders = () => {
    const headers: any = {
        // userId: localStorage.getItem('userId')
    }
    if (env.PUBLIC_CROSS_ORIGIN === 'false') {
        // headers['authorization'] = localStorage.getItem('token')
    } else {
        headers['x-api-key'] = env.PUBLIC_API_KEY
    }
    return headers
}
