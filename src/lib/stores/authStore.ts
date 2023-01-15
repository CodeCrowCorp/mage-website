import { env } from '$env/dynamic/public'
import { writable, type Writable } from 'svelte/store'
const JWT_KEY = 'jwt'

export const currentUser: Writable<any> = writable(null)

function logout() {
    setUser({ user: null })
    window.localStorage.clear()
    window.location.href = '/'
}


function getJWT() {
    return window.localStorage.getItem(JWT_KEY)
}

function getUserId() {
    return window.localStorage.getItem('userId')
}

function setJWT({ jwt }: { jwt: string }) {
    window.localStorage.setItem(JWT_KEY, jwt)
}

function setUserId({ userId }: { userId: string }) {
    window.localStorage.setItem('userId', userId)
}

function setUser({ user }: { user: any }) {
    if (!user) {
        window.localStorage.clear()
    }
    currentUser.set(user)
}

async function me() {
    const jwt = window.localStorage.getItem('jwt')
    const userId = window.localStorage.getItem('jwt')
    if (jwt === null || userId === null) {
        logout(); return null
    } else {
        return await fetch(`${env.PUBLIC_API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': jwt,
                'userId': userId
            }
        }).then(async response => {
            const res = await response.json()
            setUser({ user: res.user })
            if (res.freshJwt) setJWT({ jwt: res.freshJwt })
            return res.user
        }).catch((err) => {
            if (err.status === 401 || err.includes('Error')) logout()
            return null
        })
    }
}

export {
    logout,
    getJWT,
    getUserId,
    setJWT,
    setUserId,
    setUser,
    me
}
