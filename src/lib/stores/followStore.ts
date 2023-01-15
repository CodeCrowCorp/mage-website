import { env } from '$env/dynamic/public'

async function createFollow({ source1, source2 }: { source1: string, source2: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/follow`, {
        method: 'PUT',
        body: JSON.stringify({ source1, source2 })
    }).then(response => response.json())
}

async function getFollows({ source, sourceType, searchQuery, skip, limit }: { source: string, sourceType: string, searchQuery: string, skip: string, limit: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/follow?source=${source}&sourceType=${sourceType}&searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`, {
        method: 'GET'
    }).then(response => response.json())
}

async function getFollowCount({ source, sourceType }: { source: string, sourceType: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/follow/count?source=${source}&sourceType=${sourceType}`, {
        method: 'GET'
    }).then(response => response.json())
}

async function deleteFollow({ source1, source2 }: { source1: string, source2: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/follow?source1=${source1}&source2=${source2}`, {
        method: 'DELETE'
    }).then(response => response.json())
}

async function getFollowRelationship({ source }: { source: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/follow/relationship?source=${source}`, {
        method: 'GET'
    }).then(response => response.json())
}

async function toggleFollow({ follow, senderId, userId }: { follow: any, senderId: string, userId: string }) {
    if (follow) {
        if (!follow.isFollowing) {
            await createFollow({
                source1: senderId,
                source2: userId
            })
            follow.isFollowing = true
        } else {
            await deleteFollow({
                source1: senderId,
                source2: userId
            })
            follow.isFollowing = false
        }
    }
}

export {
    createFollow,
    getFollows,
    getFollowCount,
    deleteFollow,
    getFollowRelationship,
    toggleFollow
}