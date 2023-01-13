import { PUBLIC_API_URL, PUBLIC_WEBSOCKET_URL } from '$env/static/public'
import { writable, type Writable } from "svelte/store"

class SocketStore {
    public platformSocket: WebSocket | undefined
    public channelSocket: WebSocket | undefined

    constructor(
        public platformConnection: Writable<string> = writable(),
        public channelConnection: Writable<string> = writable(),
        public platformMessage: Writable<MessageEvent> = writable(),
        public channelMessage: Writable<MessageEvent> = writable(),
    ) {}

    public async getApiSocket() {
        return await fetch(`${PUBLIC_API_URL}/wsinit/wsid`, {
            method: 'GET',
        }).then(async response => {
            const data = await response.text()
            await this.setupWebsocketConnection({ websocketId: data, isChannelConnection: false })
        })
    }

    public async getChannelSocket({ channelId }: { channelId: string }) {
        return await fetch(`${PUBLIC_API_URL}/wsinit/channelid?channelId=${channelId}`, {
            method: 'GET',
        }).then(async response => {
            const data = await response.text()
            await this.setupWebsocketConnection({ websocketId: data, isChannelConnection: true })
        })
    }

    async setupWebsocketConnection({ websocketId, isChannelConnection }: { websocketId: string, isChannelConnection: boolean }) {
        if (!isChannelConnection) {
            this.platformSocket = new WebSocket(`${PUBLIC_WEBSOCKET_URL}/wsinit/wsid/${websocketId}/connect`)
            this.platformSocket?.addEventListener('open', (data) => {
                console.log("socket connection open")
                console.log(data)
                this.platformConnection.set('open')
            })
            this.platformSocket?.addEventListener('message', (data) => {
                console.log("listening to messages")
                console.log(data)
                this.platformMessage.set(data)
            })
            this.platformSocket?.addEventListener('error', (data) => {
                console.log("socket connection error")
                console.log(data)
            })
            this.platformSocket?.addEventListener('close', (data) => {
                console.log("socket connection close")
                console.log(data)
                this.platformConnection.set('close')
            })
        } else {
            this.channelSocket = new WebSocket(`${PUBLIC_WEBSOCKET_URL}/wsinit/channelid/${websocketId}/connect`)
            this.channelSocket?.addEventListener('open', (data) => {
                console.log("channel socket connection open")
                console.log(data)
                this.channelConnection.set('open')
            })
            this.channelSocket?.addEventListener('message', (data) => {
                console.log("listening to messages")
                console.log(data)
                this.channelMessage.set(data)
            })
            this.channelSocket?.addEventListener('error', (data) => {
                console.log("socket connection error")
                console.log(data)
            })
            this.channelSocket?.addEventListener('close', (data) => {
                console.log("socket connection close")
                console.log(data)
                this.channelConnection.set('close')
            })
        }
    }

    async emitUserConnection(userId: string, isOnline: boolean) {
        this.platformSocket?.send(
            JSON.stringify({
                eventName: isOnline ? 'user-connect' : 'user-disconnect',
                userId: userId
            })
        )
    }

    emitRemovedUser({ channelId, userId }: { channelId: string, userId: string }) {
        this.channelSocket?.send(JSON.stringify({ eventName: `user-removed`, channelId, userId }))
    }

    emitChannelUpdate({ channelId }: { channelId: string }) {
        this.channelSocket?.send(JSON.stringify({ eventName: `channel-update`, channelId }))
    }

    emitChannelAccessRequest({ channelId, userId }: { channelId: string, userId: string }) {
        this.platformSocket?.send(
            JSON.stringify({
                eventName: `channel-access-request`,
                channel: channelId,
                user: userId
            })
        )
    }

    emitChannelAccessResponse({ channelId, userId, isGrantedAccess }: { channelId: string, userId: string, isGrantedAccess: boolean }) {
        this.platformSocket?.send(
            JSON.stringify({
                eventName: `channel-access-response`,
                channel: channelId,
                user: userId,
                isGrantedAccess
            })
        )
    }

    /************ Recording ****************/

    emitVideoRecordingStarted({ channelId }: { channelId: string }) {
        this.platformSocket?.send(JSON.stringify({ eventName: `video-recording-started`, channelId }))
    }

    emitVideoRecordingEnded({ channelId, sessionCounter }: { channelId: string, sessionCounter: number }) {
        this.platformSocket?.send(
            JSON.stringify({ eventName: 'video-recording-ended', channelId, sessionCounter })
        )
    }

    emitCompositionDeleted({ channelId, compositionSid }: { channelId: string, compositionSid: string }) {
        this.platformSocket?.send(
            JSON.stringify({ eventName: 'composition-deleted', channelId, compositionSid })
        )
    }

    /************ Chat ****************/

    emitChatMessage({ source1, source2, message }: { source1: string, source2: string, message: string }) {
        this.platformSocket?.send(JSON.stringify({ eventName: `message-sent`, source1, source2, message }))
    }

    emitChatTypingByUser({ userId }: { userId: string }) {
        this.platformSocket?.send(
            JSON.stringify({
                eventName: `chat-typing`,
                user: userId,
                isTyping: true
            })
        )
    }

    /************ Channel chat ****************/

    // listenToChannel(channelId): Observable<any> {
    //     return new Observable((observer) => {
    //         this.channelSocket?.addEventListener(`message`, (data) => {
    //             const parsedData = JSON.parse(data.data)
    //             switch (parsedData.eventName) {
    //                 case `channel-message-${channelId}`:
    //                     observer.next(JSON.parse(parsedData))
    //                     break
    //             }
    //         })
    //     })
    // }

    emitChannelSubscribeByUser({ channelId, userId }: { channelId: string, userId: string }) {
        this.channelSocket?.send(
            JSON.stringify({
                eventName: `channel-subscribe`,
                channel: channelId,
                userId: userId
            })
        )
    }

    emitMessageToChannel({ channelId, message }: { channelId: string, message: string }) {
        this.channelSocket?.send(
            JSON.stringify({ eventName: `channel-message`, channel: channelId, message })
        )
    }

    emitDeleteMessageToChannel({ channelId, message }: { channelId: string, message: string }) {
        this.channelSocket?.send(
            JSON.stringify({
                eventName: `delete-channel-message`,
                channel: channelId,
                message
            })
        )
    }

    emitDeleteAllMessagesToChannel({ channelId }: { channelId: string }) {
        this.channelSocket?.send(
            JSON.stringify({ eventName: `delete-all-channel-messages`, channel: channelId })
        )
    }

    emitHistoryToChannel({ channelId, skip }: { channelId: string, skip: number }) {
        this.channelSocket?.send(
            JSON.stringify({
                eventName: `channel-message-history`,
                channel: channelId,
                skip
            })
        )
    }

    emitChannelChatTypingByUser({ channelId, typingUser }: { channelId: string, typingUser: string }) {
        this.channelSocket?.send(
            JSON.stringify({
                eventName: `channel-chat-typing`,
                channel: channelId,
                typingUser
            })
        )
    }

    /************ Channel streaming ****************/

    emitRoomMemberUpdate({ channelId, userData, isNewUser }: { channelId: string, userData: any, isNewUser: boolean }) {
        this.channelSocket?.send(
            JSON.stringify({
                eventName: 'channel-streaming-room-member-update',
                channel: channelId,
                userData,
                isNewUser
            })
        )
    }

    emitUserActions({ channelId, userData, message }: { channelId: string, userData: any, message: string }) {
        this.channelSocket?.send(
            JSON.stringify({
                eventName: `channel-streaming-user-actions`,
                channel: channelId,
                userData,
                message
            })
        )
    }

    emitReactToMessage({ channelId, message, user, reaction }: { channelId: string, message: any, user: any, reaction: string }) {
        this.channelSocket?.send(
            JSON.stringify({
                eventName: `react-to-message`,
                channel: channelId,
                message,
                user,
                reaction
            })
        )
    }









    //TODO: place these everywhere we are using socket listeners

    listenToUserConnection({ userId }: { userId: string }) {
        this.platformMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `user-connection-${userId}`) {
                //parsedData.user
            }
        })
    }

    listenToRemovedUser({ channelId }: { channelId: string }) {
        this.channelMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `user-removed-${channelId}`) {
                //parsedData.userId
            }
        })
    }

    listenToChannelUpdate({ channelId }: { channelId: string }) {
        this.channelMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `channel-update-${channelId}`) {
                // this.channelService.currentChannel.description = parsedData.channel.description
                // this.channelService.currentChannel.thumbnail = parsedData.channel.thumbnail
                // this.channelService.currentChannel.isPrivate = parsedData.channel.isPrivate
                // this.channelService.currentChannel.attachments = parsedData.channel.attachments
            }
        })
    }

    listenToChannelAccessRequest({ channelId }: { channelId: string }) {
        this.platformMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `channel-access-request` && parsedData.channelId === channelId) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToChannelAccessResponse({ channelId }: { channelId: string }) {
        this.platformMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `channel-access-response` && parsedData.channelId === channelId) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToVideoRecordingStarted({ channelId }: { channelId: string }) {
        this.platformMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `video-recording-started` && parsedData.channelId === channelId) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToCompositionStatusUpdate({ channelId }: { channelId: string }) {
        this.platformMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `composition-status-update` && parsedData.channelId === channelId) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToCompositionDeleted({ channelId }: { channelId: string }) {
        this.platformMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `composition-deleted` && parsedData.channelId === channelId) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToChatMessages() {
        this.platformMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `message-received`) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToChatTyping() {
        this.platformMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `chat-typing`) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToChannelMessage({ channelId }: { channelId: string }) {
        this.channelMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `channel-message-${channelId}`) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToChannelTyping() {
        this.channelMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `typing`) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToRoomMemberUpdate({ channelId }: { channelId: string }) {
        this.channelMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `channel-streaming-room-member-update-${channelId}`) {
                console.log("parsedData", parsedData)
            }
        })
    }

    listenToUserActions({ channelId }: { channelId: string }) {
        this.channelMessage.subscribe(value => {
            const parsedData = JSON.parse(value.data)
            if (parsedData.eventName === `channel-streaming-user-actions-${channelId}`) {
                console.log("parsedData", parsedData)
            }
        })
    }
}

export const socketStore = new SocketStore()