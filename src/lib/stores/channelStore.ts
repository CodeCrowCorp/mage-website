import { writable, type Writable } from "svelte/store"
import { env } from '$env/dynamic/public'

class ChannelStore {
    private skip = 0
    private limit = 100
    public filterTechList = []
    public techList = []

    constructor(
        public searchQuery: Writable<string> = writable(''),
        public channels: Writable<[]> = writable([]),
        public currentChannel: Writable<any> = writable(null),
    ) {}

    public async createChannel({ title, description, thumbnail, category, tags, isPrivate = false, user, channelType }
        : { title: string, description: string, thumbnail: string, category: string[], tags: string[], isPrivate: boolean, user: any, channelType: string }
    ) {
        return await fetch(`${env.PUBLIC_API_URL}/channel`, {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                thumbnail,
                category,
                tags,
                isPrivate,
                user: user._id,
                createdBy: user.displayName,
                avatar: user.avatar,
                isHostActive: true,
                channelType
            })
        }).then(async response => {
            const res = await response.json()
            if (channelType === "channel") {
                await this.addHostChannelToUser({ hostChannelId: res.channel._id })
                this.currentChannel = res
            }
            return res
        })
    }

    public async deleteChannel({ channelId }: { channelId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels/${channelId}?bucketName=attachments`, {
            method: 'DELETE'
        })
    }

    public async getChannel({ channelId }: { channelId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channel?channelId=${channelId}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async addChannelToUser({ channelId }: { channelId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/users/channels?channelId=${channelId}`, {
            method: 'GET'
        }).then(async response => {
            const res = await response.json()
            //TODO: update user in authStore
        })
    }

    public async removeChannelFromUser({ channelId, userId }: { channelId: string, userId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/users/channels?channelId=${channelId}`, {
            method: 'DELETE'
        }).then(async response => {
            const res = await response.json()
            //TODO: update user in authStore
            //if (this.user == userId) this.authService.setUser(userUpdate)
        })
    }

    public async addHostChannelToUser({ hostChannelId }: { hostChannelId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/users/host-channels?hostChannelId=${hostChannelId}`, {
            method: 'PUT'
        }).then(async response => {
            const res = await response.json()
            //TODO: update user in authStore
        })
    }

    public async removeHostChannelFromUser({ hostChannelId }: { hostChannelId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/users/host-channels?hostChannelId=${hostChannelId}`, {
            method: 'DELETE'
        }).then(async response => {
            const res = await response.json()
            //TODO: update user in authStore
        })
    }

    public async blockUserFromChannel({ channelId, userId }: { channelId: string, userId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels/blocked-users?channelId=${channelId}&userId=${userId}`, {
            method: 'PATCH'
        })
    }

    public async unblockUserFromChannel({ channelId, userId }: { channelId: string, userId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels/blocked-users?channelId=${channelId}&userId=${userId}`, {
            method: 'DELETE'
        })
    }

    public async updateChannelProperties({ channelId, updatedProperties }: { channelId: string, updatedProperties: any }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels?channelId=${channelId}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedProperties)
        })
    }

    //TODO: fix this
    // isUserBlockedFromChannel({ userId }: { userId: string }) {
    //     return this.currentChannel.blockedUsers?.some((user) => !!(user == userId))
    // }

    public async addAttachments({ channelId, attachmentUrl }: { channelId: string, attachmentUrl: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels/attachments?channelId=${channelId}&encodeURIComponent=${encodeURIComponent(attachmentUrl)}`, {
            method: 'PUT'
        })
    }

    public async deleteAttachment({ channelId, attachmentUrl }: { channelId: string, attachmentUrl: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels/attachments?channelId=${channelId}&encodeURIComponent=${encodeURIComponent(attachmentUrl)}`, {
            method: 'DELETE'
        })
    }

    public async addChannelNotificationSubscriber({ channelId, userId }: { channelId: string, userId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels/notification-subscribers?channelId=${channelId}&userId=${userId}`, {
            method: 'PUT'
        })
    }

    public async removeChannelNotificationSubscriber({ channelId, userId }: { channelId: string, userId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels/notification-subscribers?channelId=${channelId}&userId=${userId}`, {
            method: 'DELETE'
        })
    }

    public async deleteMembers({ channelId }: { channelId: string }) {
        return await fetch(`${env.PUBLIC_API_URL}/channel-members?channelId=${channelId}`, {
            method: 'DELETE'
        })
    }

    resetSkipLimit() {
        this.skip = 0
        this.limit = 100
    }

    public async getInitialChannels() {
        this.currentChannel.set(null)
        this.searchQuery.set('')
        this.filterTechList = []
        const user = null
        //TODO: get this.authStore.currentUser
        if (user) {
            this.channels = await this.getMyChannels()
        } else {
            this.channels.set([])
        }
        await this.getChannels({ isRefresh: true })
        return this.channels
    }

    public async getMyChannels() {
        return await fetch(`${env.PUBLIC_API_URL}/channels/me/hosted`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getChannelsByUserId({ userId, searchQuery = '', skip = 0, limit = 50 }: { userId: string, searchQuery: string, skip?: number, limit?: number }) {
        return await fetch(`${env.PUBLIC_API_URL}/channels/user?userId=${userId}&searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getChannels({ isRefresh = false }: { isRefresh?: boolean } = {}) {
        if (isRefresh) {
            this.resetSkipLimit()
        }

        return await fetch(`${env.PUBLIC_API_URL}/channels?searchQuery=${this.searchQuery}&category=${this.filterTechList.map((item: any) => item.item_text).join()}&skip=${this.skip}&limit=${this.limit}`, {
            method: 'GET'
        }).then(async response => {
            const res = await response.json()
            if (res.length) {
                this.skip += this.limit
                //TODO: push res to channels
                // this.channels.push(...res)
            } else {
                //TODO: show alert
                // if ((this.searchQuery || this.filterTechList.length) && !this.skip)
                //     this.snackBar.open('No results with the search criteria', null, {
                //         duration: 2000
                //     })
            }
            return this.channels
        })

    }

    public async searchChannels() {
        this.channels.set([])
        if (!this.searchQuery && !this.filterTechList.length) {
            return this.getInitialChannels()
        } else {
            return this.getChannels({ isRefresh: true })
        }
    }

    async leaveChannel({ userId, deleteOrLeaveOnExit = false }: { userId: string, deleteOrLeaveOnExit?: boolean }) {
        //TODO: fix writeable subscribe
        this.currentChannel.subscribe(async value => {
            if (value) {
                if (value.user === userId) {
                    // if host
                    if (deleteOrLeaveOnExit) {
                        await this.removeHostChannelFromUser({
                            hostChannelId: value._id
                        })
                        await this.deleteChannel({ channelId: value._id })
                        await this.deleteMembers({
                            channelId: value._id
                        })
                    }
                } else {
                    // if participant
                    if (deleteOrLeaveOnExit) {
                        await this.removeChannelFromUser({
                            channelId: value._id,
                            userId
                        })
                    }
                }
                this.currentChannel.set(null)
            }
        })
    }

    async enterChannel({ channel }: { channel: any }) {
        this.currentChannel = channel
        return this.currentChannel
    }

    async toggleNotifications({ channel, userId }: { channel: any, userId: string }) {
        if (channel?.notificationSubscribers?.includes(userId)) {
            await this.removeChannelFromUser({ channelId: channel._id, userId })
            await this.removeChannelNotificationSubscriber({
                channelId: channel._id,
                userId
            })
        } else {
            await this.addChannelToUser({ channelId: channel._id })
            await this.addChannelNotificationSubscriber({
                channelId: channel._id,
                userId
            })
        }
    }

    // async sendToken({ channelId }) {
    //     await lastValueFrom(this.http
    //         .get(`${env.PUBLIC_API_URL}/token/sendToken?channelId=${channelId}`, {
    //             responseType: 'text'
    //         })).then((res) => {
    //             return this.snackBar.open('You received 1 recursion Token', null, {
    //                 duration: 2500
    //             })
    //         }).catch((err) => {
    //             console.log('Err', err)
    //         })
    // }

    // async getTechList() {
    //     if (this.techList.length < 1) {
    //         const web2Assets: any = await lastValueFrom(this.http
    //             .get(`${environment.hostUrl}/assets/images/web2/_categoryWeb2.json`))
    //         const web3Assets: any = await lastValueFrom(this.http
    //             .get(`${environment.hostUrl}/assets/images/web3/_categoryWeb3.json`))
    //         const gameAssets: any = await lastValueFrom(this.http
    //             .get(`${environment.hostUrl}/assets/images/games/_categoryGames.json`))
    //         web3Assets.forEach((file) => {
    //             let fileName = file.item_image.substring(file.item_image.lastIndexOf('/') + 1)
    //             fileName = fileName.substring(0, fileName.indexOf('.'))
    //             const nameAndTickerList = fileName.split('-')
    //             const ticker = nameAndTickerList.pop().toUpperCase()
    //             const fullName = nameAndTickerList
    //                 .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    //                 .join(' ')
    //             file.item_text = `${fullName} (${ticker})`
    //         })
    //         web2Assets.push(...web3Assets)
    //         gameAssets.forEach((file) => {
    //             let fileName = file.item_image.substring(file.item_image.lastIndexOf('/') + 1)
    //             fileName = fileName.substring(0, fileName.indexOf('.'))
    //             const nameSplitList = fileName.split('-')
    //             const fullName = nameSplitList
    //                 .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    //                 .join(' ')
    //             file.item_text = fullName
    //         })
    //         web2Assets.push(...gameAssets)
    //         this.techList = web2Assets
    //         this.techList.sort((a, b) => a.item_text.localeCompare(b.item_text))
    //     }
    // }
}

export const channelStore = new ChannelStore()