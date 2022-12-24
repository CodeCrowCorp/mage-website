import { PUBLIC_API_URL } from '$env/static/public'

class AdminStore {
    public async uploadFile({ file, url }: { file: File, url: string }) {
        return await fetch(url, {
            method: 'PUT',
            headers: {
                'x-amz-acl': 'public-read',
                'Content-Type': file.type
            }, //reportProgress: true, observe: 'events',
            body: JSON.stringify(file)
        }).then(response => response.json()).catch(err => console.log('err', err))
    }

    public async getUserRole() {
        return await fetch(`${PUBLIC_API_URL}/roles/role-mapping`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getRoles() {
        return await fetch(`${PUBLIC_API_URL}/roles`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getAdmins({ roleId }: { roleId: string }) {
        return await fetch(`${PUBLIC_API_URL}/roles/users?roleId=${roleId}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async addAdmin({ userId, roleId }: { userId: string, roleId: string }) {
        return await fetch(`${PUBLIC_API_URL}/roles/role-mapping`, {
            method: 'POST',
            body: JSON.stringify({ roleId, userId })
        }).then(response => response.json())
    }

    public async removeAdmin({ userId, roleId }: { userId: string, roleId: string }) {
        return await fetch(`${PUBLIC_API_URL}/roles/role-mapping`, {
            method: 'PATCH',
            body: JSON.stringify({ roleId, userId })
        }).then(response => response.json())
    }

    public async getUploadURL({ fileName, fileType, bucketName }: { fileName: string, fileType: string, bucketName: string }) {
        return await fetch(`${PUBLIC_API_URL}/attachments/url`, {
            method: 'PUT',
            body: JSON.stringify({ fileName, fileType, bucketName })
        }).then(response => response.json())
    }

    public async getVideos({ filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 5 }: { filter: string, sortOrder: string, pageNumber: number, pageSize: number }) {
        return await fetch(`${PUBLIC_API_URL}/videos?admin=1&filter=${filter}&skip=${pageNumber}&limit=${pageSize}&sort=${sortOrder}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getAllVideos() {
        return await fetch(`${PUBLIC_API_URL}/videos/all?admin=1`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getChannels() {
        return await fetch(`${PUBLIC_API_URL}/channels`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getChannelLiveStreams({ id }: { id: string }) {
        return await fetch(`${PUBLIC_API_URL}/channels/live-streams?channelId=${id}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getMonthLiveStreaming() {
        return await fetch(`${PUBLIC_API_URL}/streams`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async createLegalDoc({ title, createdAt, pdf }: { title: string, createdAt: string, pdf: string }) {
        return await fetch(`${PUBLIC_API_URL}/legal`, {
            method: 'POST',
            body: JSON.stringify({ title, createdAt, pdf })
        }).then(response => response.json())
    }

    public async getLegalDocs({ bucketName }: { bucketName: string }) {
        return await fetch(`${PUBLIC_API_URL}/legal/get/objects?bucketName=${bucketName}`, {
            method: 'GET',
        }).then(response => response.json())
    }

    public async setUserBan({ id, isBanned }: { id: string, isBanned: string }) {
        return await fetch(`${PUBLIC_API_URL}/users/ban?userId=${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ isBanned })
        }).then(response => response.json())
    }
}

export const adminStore = new AdminStore()