import { env } from '$env/dynamic/public'
import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store'

export const currentUser: Writable<any> = writable(null)

const logout = () => currentUser.set(null);


currentUser.subscribe((value) => {
    if(browser){
        if (value)
        {
            console.log(value)
            window.localStorage.setItem('userId', (value.userId));
            window.localStorage.setItem('jwt', (value.jwt));
        }
        else{
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('jwt') // for logout
            logout()
        }
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
    me
}
