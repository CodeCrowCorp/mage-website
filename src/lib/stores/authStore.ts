import { env } from '$env/dynamic/public'
import { onMount } from 'svelte'
import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store'
const JWT_KEY = 'jwt'

const defaultValue = null;
const initialValue = browser ? {userId: window.localStorage.getItem('userId'), jwt: window.localStorage.getItem('jwt'), user: {}} ?? defaultValue : defaultValue;


export const currentUser: Writable<any> = writable(initialValue)

const logout = () => currentUser.set(null);


currentUser.subscribe((value) => {
    if(browser)
    if (value)
    {
        localStorage.setItem('userId', (value.userId));
        localStorage.setItem('jwt', (value.jwt));
    }
    else{
        window.localStorage.clear(); // for logout
    }
  });


async function me(userId: string, jwt: string) {

    try{
         const response = await fetch(`${env.PUBLIC_API_URL}/auth/me`, {
             method: 'GET',
             headers: {
                 'Authorization': jwt,
                 'userId': userId
             }
         })

         const res = await response.json()

        // console.log(res.user)
       //  setUser({ user: res.user })

         if (res.freshJwt) currentUser.set({userId: userId, jwt: res.freshJwt, user: res.user })
         return res
     }
    catch(err: any) {
             if (err.status === 401 || err.includes('Error')) logout()
             return null
         }
     
}

export {
    logout,
  //  setUser,
    me
}
