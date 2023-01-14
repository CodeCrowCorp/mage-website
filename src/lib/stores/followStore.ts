import { env } from '$env/dynamic/public'

class FollowStore {
    public async createFollow({ source1, source2 }: { source1: string, source2: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/follow`, {
            method: 'PUT',
            body: JSON.stringify({ source1, source2 })
        }).then(response => response.json())
    }

    public async getFollows({ source, sourceType, searchQuery, skip, limit }: { source: string, sourceType: string, searchQuery: string, skip: string, limit: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/follow?source=${source}&sourceType=${sourceType}&searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getFollowCount({ source, sourceType }: { source: string, sourceType: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/follow/count?source=${source}&sourceType=${sourceType}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async deleteFollow({ source1, source2 }: { source1: string, source2: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/follow?source1=${source1}&source2=${source2}`, {
            method: 'DELETE'
        }).then(response => response.json())
    }

    public async getFollowRelationship({ source }: { source: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/follow/relationship?source=${source}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async toggleFollow({ follow, senderId, userId }: { follow: any, senderId: string, userId: string }) {
        if (follow) {
            if (!follow.isFollowing) {
                await this.createFollow({
                    source1: senderId,
                    source2: userId
                })
                follow.isFollowing = true
            } else {
                await this.deleteFollow({
                    source1: senderId,
                    source2: userId
                })
                follow.isFollowing = false
            }
        }
    }
}

export const followStore = new FollowStore()