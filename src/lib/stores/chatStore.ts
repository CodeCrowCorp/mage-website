import { writable, type Writable } from 'svelte/store'
import { socketStore } from '$lib/stores/socketStore'
import { PUBLIC_API_URL } from '$env/static/public'
import { userStore } from '$lib/stores/userStore'
import { authStore } from '$lib/stores/authStore'
import { channelStore } from '$lib/stores/channelStore'

class ChatStore {
    public lastMessageSendDate: Date = new Date()
    private skip = 0
    private limit = 100

    constructor(
        public searchQuery: Writable<string> = writable(''),
        public chats: Writable<[]> = writable([]),
        public messages: Writable<[]> = writable([]),
        public activeTabs: Writable<[]> = writable([]),
        public isShowingSearchResults: Writable<boolean> = writable(false),
    ) {}

    resetSkipLimit() {
        this.skip = 0
        this.limit = 100
    }

    deleteMessage({ message, channelId }: { message: any, channelId: string }) {
        socketStore.emitDeleteMessageToChannel({ channelId, message: JSON.stringify(message) })
    }

    deleteAllMessages({ channelId }: { channelId: string }) {
        socketStore.emitDeleteAllMessagesToChannel({ channelId })
    }

    public async postFile({ channelId, fileToUpload }: { channelId: string, fileToUpload: File }) {
        const formData: FormData = new FormData()
        formData.append('file', fileToUpload, fileToUpload.name)
        formData.append('channelId', channelId)
        formData.append('name', fileToUpload.name)
        formData.append('type', fileToUpload.type)
        return await fetch(`${PUBLIC_API_URL}/attachments/file`, { method: 'POST', body: JSON.stringify(formData) })
    }

    public async deleteFile({ key }: { key: string }) {
        return await fetch(`${PUBLIC_API_URL}/attachments/file?key=${key}`, {
            method: 'DELETE'
        })
    }

    public async getTrendingGifs() {
        return await fetch(`${PUBLIC_API_URL}/giphy/trending`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async searchGifs({ query }: { query: string }) {
        return await fetch(`${PUBLIC_API_URL}/giphy/search?${query}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getMessages({ chat, chatType }: { chat: any, chatType: string }) {
        const data = { limit: this.limit, skip: 0 }
        if (chatType == 'channelChat') {
            this.skip = this.skip + this.limit
            data.skip = this.skip
            socketStore.emitHistoryToChannel({ channelId: chat.channel, skip: data.skip })
        } else if (chatType == 'oneToOneChat') {
            data.skip = chat.skip
        }
    }

    public async sendChannelMessage({ channel, attributes }: { channel: any, attributes: any }) {
        const dateNow = new Date()
        const diff = Math.round(
            Math.abs((dateNow.getTime() - this.lastMessageSendDate.getTime()) / 1000)
        )
        if (diff <= 0.7) {
            //TODO: show alert
            // this.snackBar.open('Please be courteous to other users', null, {
            //     duration: 1000
            // })
        } else {
            //TODO: get currentUser
            const user: any = null
            attributes.userId = user._id
            attributes.avatar = user.avatar
            const completeMessage = {
                attributes: attributes,
                body: attributes.text,
                state: { timestamp: new Date().toISOString() },
                user: user,
                author: user.displayName
            }
            socketStore.emitMessageToChannel({ channelId: channel._id, message: completeMessage })
            this.lastMessageSendDate = new Date()
            // this.sendEmailAndWebNotifications({ channel: channel._id, user, attributes })
        }
    }

    public async sendChatMessage({ chat, attributes }: { chat: any, attributes: any }) {
        //TODO: get currentUser
        const user: any = null
        attributes.userId = user._id
        attributes.avatar = user.avatar
        const completeMessage = {
            attributes: attributes,
            body: attributes.text,
            state: { timestamp: new Date().toISOString() },
            user: user,
            author: user.displayName
        }
        socketStore.emitChatMessage({ source1: chat.source1, source2: chat.source2, message: completeMessage })
        this.lastMessageSendDate = new Date()
        // this.sendEmailAndWebNotifications({ channel: chat._id, user, attributes })
    }

    // public async sendEmailAndWebNotifications({ channel, user, attributes }: { channel: any, user: any, attributes: any }) {
    //     let notificationSubscribers = []
    //     notificationSubscribers = channel?.notificationSubscribers?.filter((id: any) =>
    //         id == user._id ? false : true
    //     )
    //     if (notificationSubscribers?.length) {
    //         const sendNotificationsTo: any[] = []
    //         // const sendEmailsTo = []
    //         notificationSubscribers = await userStore.getUsersByIds(notificationSubscribers)
    //         notificationSubscribers.forEach((user: any) => {
    //             if (user.isWebNotificationsEnabled) sendNotificationsTo.push(user._id)
    //             // if (user.isEmailNotificationsEnabled) sendEmailsTo.push(user._id)
    //         })
    //         const body = `${user.customUsername}: ${attributes.text}`
    //         const title = `New message at ${channel.title}`
    //         const sendToList = []
    //         // if (sendNotificationsTo.length) {
    //         //     sendToList.push(
    //         //         this.notificationService.sendWebNotifications({
    //         //             body,
    //         //             title,
    //         //             userIds: sendNotificationsTo
    //         //         })
    //         //     )
    //         // }
    //         // if (sendEmailsTo.length) {
    //         //   sendToList.push(this.notificationService.sendEmails({
    //         //     subject: `Chat notification from codecrow.io`, message: body, name: channel.title, userIds: sendEmailsTo, url: `${environment.hostUrl}/channel/${channel._id}`
    //         //   }))
    //         // }
    //         return Promise.all(sendToList)
    //     } else {
    //         return Promise.resolve()
    //     }
    // }

    emitChannelChatTypingByUser({ typingUser, channelId = '' }: { typingUser: any, channelId: string }) {
        if (!channelId) {
            socketStore.emitChatTypingByUser(typingUser)
        } else {
            socketStore.emitChannelChatTypingByUser({ channelId, typingUser })
        }
    }

    public async createChat({ source1, source2 }: { source1: string, source2: string }) {
        return await fetch(`${PUBLIC_API_URL}/chats`, {
            method: 'PUT',
            body: JSON.stringify({ source1, source2 }),
        }).then(async response => {
            const res = await response.json()
            //TODO: fix array push to writable
            // this.chats.subscribe((value: any) => {
            //     const doesChatExist = value.some((cht: any) => res._id === cht._id)
            //     if (!doesChatExist) value.push(res)
            //     return res
            // })
        })
    }

    public async getChat({ source1, source2 }: { source1: string, source2: string }) {
        return await fetch(`${PUBLIC_API_URL}/chats/me?source1=${source1}&source2=${source2}`, {
            method: 'GET'
        }).then(response => response.json())
    }

    public async getChats(isRefresh = false) {
        if (isRefresh) {
            this.chats.set([])
            this.resetSkipLimit()
        }
        return await fetch(`${PUBLIC_API_URL}/chats?searchQuery=${this.searchQuery}&skip=${this.skip}&limit=${this.limit}`, {
            method: 'GET'
        }).then(async response => {
            const res = await response.json()
            //TODO: fix array push to writable
            // if (chats.length) {
            //     this.skip += this.limit
            //     this.chats.push(...chats)
            // } else {
            //TODO: show alert
            // if (this.searchQuery && !this.skip)
            //     this.snackBar.open('No results with the search criteria', null, {
            //         duration: 2000
            //     })
            // }
            // return this.chats
        })
    }

    public async deleteChat({ chat }: { chat: any }) {
        // const dialogData: DialogData = {
        //     title: 'Delete Chat',
        //     message: 'Are you sure you want to delete this chat?',
        //     okText: 'Yes',
        //     cancelText: 'Cancel'
        // }

        // const dialogRef = this.dialogService.openDialog(dialogData, {
        //     disableClose: true
        // })

        // dialogRef.afterClosed().subscribe(async (result: any) => {
        //     if (result) {
        await fetch(`${PUBLIC_API_URL}/chats?chatId=${chat._id}`, {
            method: 'DELETE'
        }).then(async response => {
            await response.json()
            //TODO: fix array filter to writable
            // this.chats.set(this.chats.filter((cht) => cht.chat._id !== chat._id))
        })
        //     }
        // })
    }

    public async updateChatProperties({ chatId, updatedProperties }: { chatId: string, updatedProperties: any }) {
        return await fetch(`${PUBLIC_API_URL}/chats?chatId=${chatId}`, {
            method: 'PATCH', body: JSON.stringify(updatedProperties)
        }).then(response => response.json())
    }

    public async incrementUnreadMessageCount({ chatId }: { chatId: string }) {
        return await fetch(`${PUBLIC_API_URL}/chats?unread/chatId=${chatId}`, {
            method: 'PATCH'
        })
    }

    public async clearUnreadMessageCount({ chatId }: { chatId: string }) {
        return await fetch(`${PUBLIC_API_URL}/chats?unread/chatId=${chatId}`, {
            method: 'DELETE'
        })
    }

    public async searchChats() {
        this.chats.set([])
        return this.getChats(true)
    }

    public async openChat({ chat, friendGroup = null }: { chat: any, friendGroup: any }) {
        if (friendGroup) {
            return this.activateGroupTab(friendGroup)
        }
        //TODO: get writable channel id
        // if (!chat.chat) {
        //     const existingChat = await this.getChat({
        //         source1: authStore.currentUser._id,
        //         source2: chat._id
        //     })
        //     if (!existingChat) {
        //         chat = await this.createChat({
        //             source1: authStore.currentUser._id,
        //             source2: chat._id
        //         })
        //     } else {
        //         chat = existingChat
        //     }
        // }
        // this.activateChatTab(chat)
        // socketStore.emitChatMessage({
        //     source1: authStore.currentUser._id,
        //     source2: chat._id,
        //     message: "incoming message"
        // })

    }

    public async activateChatTab({ chat }: { chat: any }) {
        const user = authStore.currentUser
        if (this.checkAlreadyExist(chat)) return
        //TODO: get writable activeTabs
        // this.activeTabs.push(chat)
        await this.clearUnreadMessageCount({ chatId: chat.chat._id })
        chat.chat.unreadMessageCount = 0
    }

    public async activateGroupTab({ group }: { group: any }) {
        const user = authStore.currentUser
        if (this.checkAlreadyExist(group)) return
        //TODO: get writable activeTabs
        // socketStore.emitChannelSubscribeByUser(group.channelId, user._id)
        // this.activeTabs.push(group)
    }

    checkAlreadyExist({ item }: { item: any }) {
        //TODO: get writable currentUser
        // const chat = this.activeTabs.find((chat) => {
        //     if (chat._id === item._id || ((chat.source1 === item.source1 && chat.source2 === item.source2) ||
        //         (chat.source2 === item.source1 && chat.source1 === item.source2))) {
        //         return true
        //     }
        // })
        // return (this.activeTabs.indexOf(item) !== -1) || (chat !== undefined)
        return null
    }

    public async incomingMessageActivateChatTab(data: any) {
        const user = authStore.currentUser
        const otherUser = userStore.getUserById(data.source1)
        const chat = null
        //TODO: get writable currentUser
        // const existingChat = await this.getChat({
        //     source1: authStore.currentUser._id,
        //     source2: data.source1
        // })
        // if (!existingChat) {
        //     chat = await this.createChat({
        //         source1: authStore.currentUser._id,
        //         source2: data.source1,
        //         user: otherUser
        //     })
        // } else {
        //     chat = existingChat
        // }
        // if (!user.isDoNotDisturbEnabled) {
        //     chat.isUserRequestingToOpenChat = true
        //     this.initIncomingMessage = data
        //     this.activateChatTab(chat)
        // }
    }

    public async blockUser({ senderId, isBlocked }: { senderId: string, isBlocked: boolean }) {
        //TODO: get writable channel id
        // await channelStore.blockUserFromChannel({
        //     channelId: channelStore.currentChannel._id,
        //     userId: senderId
        // })
        // await channelStore.removeChannelNotificationSubscriber({
        //     channelId: channelStore.currentChannel._id,
        //     userId: senderId
        // })
        // socketStore.emitRemovedUser(channelStore.currentChannel._id, senderId)
        // channelStore.currentChannel.blockedUsers?.push(senderId)
        // isBlocked = channelStore.isUserBlockedFromChannel(senderId)
    }

    public async unblockUser({ senderId, isBlocked }: { senderId: string, isBlocked: boolean }) {
        //TODO: get writable channel id
        // await channelStore.unblockUserFromChannel({
        //     channelId: channelStore.currentChannel._id,
        //     userId: senderId
        // })
        // channelStore.currentChannel.blockedUsers =
        //     channelStore.currentChannel.blockedUsers?.filter(
        //         (user) => !!(user != senderId)
        //     )
        // isBlocked = channelStore.isUserBlockedFromChannel(senderId)
    }

    public async showDeleteMessageDialog({ oneVone, message }: { oneVone: boolean, message: any }) {
        // const dialogData: DialogData = {
        //     title: 'Delete Message',
        //     message: 'Are you sure you want to delete this message?',
        //     okText: 'Yes',
        //     cancelText: 'Cancel'
        // }

        // const dialogRef = this.dialogService.openDialog(dialogData, {
        //     disableClose: true
        // })

        // dialogRef.afterClosed().subscribe((result) => {
        // if (result) {
        //TODO: show alert
        this.commitDeleteMessage({ oneVone, message })
        // }
        // })
    }

    public async commitDeleteMessage({ oneVone, message }: { oneVone: boolean, message: any }) {
        let chan = null
        if (oneVone || !channelStore.currentChannel) {
            chan = { _id: message.channelId } // if friend chat
        } else {
            chan = channelStore.currentChannel // if channel chat
        }
        if (chan) {
            //TODO: get writable channel id
            // this.deleteMessage({ message, channelId: chan._id })
        }
    }
}

export const chatStore = new ChatStore()