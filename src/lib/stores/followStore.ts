import { PUBLIC_API_URL } from '$env/static/public'

class FollowStore {
    public async createFollow({ source1, source2 }: { source1: string, source2: string }) {
        return await fetch(`${PUBLIC_API_URL}/follow`, {
            method: 'PUT',
            body: JSON.stringify({ source1, source2 })
        }).then(response => response.json())
    }

    public async getFollows({ source, sourceType, searchQuery, skip, limit }: { source: string, sourceType: string, searchQuery: string, skip: string, limit: string }) {
        return await fetch(`${PUBLIC_API_URL}/follow?source=${source}&sourceType=${sourceType}&searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getFollowCount({ source, sourceType }: { source: string, sourceType: string }) {
        return await fetch(`${PUBLIC_API_URL}/follow/count?source=${source}&sourceType=${sourceType}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async deleteFollow({ source1, source2 }: { source1: string, source2: string }) {
        return await fetch(`${PUBLIC_API_URL}/follow?source1=${source1}&source2=${source2}`, {
            method: 'DELETE'
        }).then(response => response.json())
    }

    public async getFollowRelationship({ source }: { source: string }) {
        return await fetch(`${PUBLIC_API_URL}/follow/relationship?source=${source}`, {
            method: 'GET'
        }).then(response => response.json())
    }
}

export const followStore = new FollowStore()