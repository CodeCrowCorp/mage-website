import { env } from '$env/dynamic/public'

async function getUserById({ userId }: { userId: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/users/search/id?userId=${userId}`, {
        method: 'GET'
    }).then(response => response.json())
}

async function getUsersByIds({ userIds }: { userIds: Array<string> }) {
    return await fetch(`${env.PUBLIC_API_URL}/users/search/ids`, {
        method: 'POST',
        body: JSON.stringify({ userIds })
    }).then(response => response.json())
}

async function getUsersByName({ name }: { name: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/users/search/name?name=${name}`, {
        method: 'GET'
    }).then(response => response.json())
}

async function getUserByCustomUsername({ customUsername }: { customUsername: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/users/search/custom-username?customUsername=${customUsername}`, {
        method: 'GET'
    }).then(response => response.json())
}

async function updateUser(body: any) {
    return await fetch(`${env.PUBLIC_API_URL}/users/current`, {
        method: 'PATCH',
        body: JSON.stringify(body)
    }).then(async response => {
        //TODO: update user in auth service
        const userUpdate = await response.json()
        // this.authService.setUser(userUpdate)
        return userUpdate
    })
}

async function updateAvatar({ fileToUpload, fileName }: { fileToUpload: any, fileName: string }) {
    const formData: FormData = new FormData()
    formData.append('file', fileToUpload, fileName)
    formData.append('bucketName', 'avatars')
    return await fetch(`${env.PUBLIC_API_URL}/users/current/avatar`, {
        method: 'PUT',
        body: formData
    }).then(async response => {
        //TODO: update user in auth service
        const userUpdate = await response.json()
        // this.authService.setUser(userUpdate)
        return userUpdate
    })
}

async function updateCustomUsername({ customUsername }: { customUsername: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/users/current/custom-username`, {
        method: 'PATCH',
        body: JSON.stringify({ customUsername })
    }).then(async response => {
        //TODO: update user in auth service
        const userUpdate = await response.json()
        // if (!userUpdate.exists) {
        //     this.authService.setUser(userUpdate)
        // }
        return userUpdate
    })
}

export {
    getUserById,
    getUsersByIds,
    getUsersByName,
    getUserByCustomUsername,
    updateUser,
    updateAvatar,
    updateCustomUsername
}