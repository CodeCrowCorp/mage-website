import { env } from '$env/dynamic/public'
import { getHeaders } from '$lib/stores/helperStore'

async function createFollow({ source1, source2 }: { source1: string, source2: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/subscribe`, {
        method: 'PUT',
        body: JSON.stringify({ source1, source2 }),
        headers: getHeaders()
    }).then(response => response.json())
}

async function getFollows({ source, sourceType, searchQuery, skip, limit }: { source: string, sourceType: string, searchQuery: string, skip: string, limit: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/subscribe?source=${source}&sourceType=${sourceType}&searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`, {
        method: 'GET'
        ,
        headers: getHeaders()
    }).then(response => response.json())
}

async function getFollowCount({ source, sourceType }: { source: string, sourceType: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/subscribe/count?source=${source}&sourceType=${sourceType}`, {
        method: 'GET',
        headers: getHeaders()
    }).then(response => response.json())
}

async function deleteFollow({ source1, source2 }: { source1: string, source2: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/subscribe?source1=${source1}&source2=${source2}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(response => response.json())
}

async function getFollowRelationship({ source }: { source: string }) {
    return await fetch(`${env.PUBLIC_API_URL}/subscribe/relationship?source=${source}`, {
        method: 'GET',
        headers: getHeaders()
    }).then(response => response.json())
}

async function toggleFollow({ subscribe, senderId, userId }: { subscribe: any, senderId: string, userId: string }) {
    if (subscribe) {
        if (!subscribe.isFollowing) {
            await createFollow({
                source1: senderId,
                source2: userId
            })
            subscribe.isFollowing = true
        } else {
            await deleteFollow({
                source1: senderId,
                source2: userId
            })
            subscribe.isFollowing = false
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