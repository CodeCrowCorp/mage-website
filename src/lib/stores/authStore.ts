import { env } from '$env/dynamic/public'
import { writable, type Writable } from "svelte/store"
const JWT_KEY = 'jwt'

class AuthStore {
    constructor(
        public currentUser: Writable<any> = writable(null),
    ) {}

    public logout() {
        this.setUser({ user: null })
        window.localStorage.clear()
        window.location.href = '/'
    }

    public setJWT({ jwt }: { jwt: string }) {
        window.localStorage.setItem(JWT_KEY, jwt)
    }

    public setUserId({ userId }: { userId: string }) {
        window.localStorage.setItem('userId', userId)
    }

    public setUser({ user }: { user: any }) {
        if (!user) {
            window.localStorage.clear()
        }
        this.currentUser = user
    }

    public async me() {
        const jwt = window.localStorage.getItem('jwt')
        const userId = window.localStorage.getItem('jwt')
        if (jwt === null || userId === null) {
            this.logout(); return null
        } else {
            return await fetch(`${env.PUBLIC_API_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': jwt,
                    'userId': userId
                }
            }).then(async response => {
                const res = await response.json()
                this.setUser({ user: res.user })
                if (res.freshJwt) this.setJWT({ jwt: res.freshJwt })
                return res.user
            }).catch((err) => {
                if (err.status === 401 || err.includes('Error')) this.logout()
                return null
            })
        }
    }
}

export const authStore = new AuthStore()