import { PUBLIC_API_URL } from '$env/static/public'
import { writable } from "svelte/store"

class SocketStore {

    constructor() {
    }

    async setupWebsocketConnection(websocketId, isChannelConnection) {
        if (!isChannelConnection) {
            return new Promise((resolve) => {
                this.apiSocket = new WebSocket(`${environment.webSocketUrl}/wsinit/wsid/${websocketId}/connect`)

                this.apiSocket.addEventListener('open', (data) => {
                    console.log("socket connection open")
                    console.log(data)
                    resolve(true)
                })
                this.apiSocket.addEventListener('message', (data) => {
                    console.log("listening to messages")
                    console.log(data)
                })
                this.apiSocket.addEventListener('error', (data) => {
                    console.log("socket connection error")
                    console.log(data)
                })
                this.apiSocket.addEventListener('close', (data) => {
                    console.log("socket connection close")
                    console.log(data)
                })
            })
        }
        if (isChannelConnection) {

            return new Promise((resolve) => {
                this.channelSocket = new WebSocket(`${environment.webSocketUrl}/wsinit/channelid/${websocketId}/connect`)

                this.channelSocket.addEventListener('open', (data) => {
                    console.log("channel socket connection open")
                    console.log(data)
                    resolve(true)
                })
                this.channelSocket.addEventListener('message', (data) => {
                    console.log("listening to messages")
                    console.log(data)
                })
                this.channelSocket.addEventListener('error', (data) => {
                    console.log("socket connection error")
                    console.log(data)
                })
                this.channelSocket.addEventListener('close', (data) => {
                    console.log("socket connection close")
                    console.log(data)
                })
            })

        }
    }

    setupChannelSocketConnection(channelId) {
        return this.http.get(`${environment.apiUrl}/wsinit/channelid?channelId=${channelId}`, { responseType: 'text' }).toPromise()
    }

    async emitUserConnection(userId: string, isOnline: boolean) {
        if (!this.isBrowser) return
        return new Promise((resolve) => {
            this.apiSocket.send(
                JSON.stringify({
                    eventName: isOnline ? 'user-connect' : 'user-disconnect',
                    userId: userId
                })
            )
            resolve(isOnline)
        })
    }

    listenToUserConnection(userId: string): Observable<any> {
        return new Observable((observer) => {
            this.apiSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `user-connection-${userId}`) {
                    this.sessionName = JSON.parse(data.data).user.userId
                    observer.next(JSON.parse(data.data))
                }
            })
        })
    }

    listenToRemovedUser(channelId): Observable<any> {
        return new Observable((observer) => {
            this.channelSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `user-removed-${channelId}`) {
                    observer.next(JSON.parse(data.data))
                }
            })
        })
    }

    emitRemovedUser(channelId, userId) {
        this.channelSocket.send(JSON.stringify({ eventName: `user-removed`, channelId, userId }))
    }

    listenToChannelUpdate(channelId): Observable<any> {
        return new Observable((observer) => {
            this.channelSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `channel-update-${channelId}`) {
                    observer.next(JSON.parse(data.data))
                }
            })
        })
    }

    emitChannelUpdate(channelId) {
        this.channelSocket.send(JSON.stringify({ eventName: `channel-update`, channelId }))
    }

    listenToChannelAccessRequest({ channelId }): Observable<any> {
        return new Observable((observer) => {
            this.apiSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `channel-access-request` && JSON.parse(data.data).channelId === channelId) {
                    observer.next(data)
                }
            })
        })
    }

    emitChannelAccessRequest({ channelId, userId }) {
        this.apiSocket.send(
            JSON.stringify({
                eventName: `channel-access-request`,
                channel: channelId,
                user: userId
            })
        )
    }

    listenToChannelAccessResponse({ channelId }): Observable<any> {
        return new Observable((observer) => {
            this.apiSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `channel-access-response` && JSON.parse(data.data).channelId === channelId) {
                    observer.next(data)
                }
            })
        })
    }

    emitChannelAccessResponse({ channelId, userId, isGrantedAccess }) {
        this.apiSocket.send(
            JSON.stringify({
                eventName: `channel-access-response`,
                channel: channelId,
                user: userId,
                isGrantedAccess
            })
        )
    }


    /************ Recording ****************/

    emitVideoRecordingStarted({ channelId }) {
        this.apiSocket.send(JSON.stringify({ eventName: `video-recording-started`, channelId }))
    }

    listenToVideoRecordingStarted({ channelId }): Observable<any> {
        return new Observable((observer) => {
            this.apiSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `video-recording-started` && JSON.parse(data.data).channelId === channelId) {
                    observer.next(JSON.parse(data.data))
                    return data
                }
            })
        })
    }

    emitVideoRecordingEnded({ channelId, sessionCounter }) {
        this.apiSocket.send(
            JSON.stringify({ eventName: 'video-recording-ended', channelId, sessionCounter })
        )
    }

    listenToCompositionStatusUpdate({ channelId }): Observable<any> {
        return new Observable((observer) => {
            this.apiSocket.addEventListener(`message`, (data) => {
                if (
                    JSON.parse(data.data).eventName === `composition-status-update` &&
                    JSON.parse(data.data).channelId === channelId
                ) {
                    observer.next(JSON.parse(data.data))
                    return data
                }
            })
        })
    }

    emitCompositionDeleted({ channelId, compositionSid }) {
        this.apiSocket.send(
            JSON.stringify({ eventName: 'composition-deleted', channelId, compositionSid })
        )
    }

    listenToCompositionDeleted({ channelId }): Observable<any> {
        return new Observable((observer) => {
            this.apiSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `composition-deleted` && JSON.parse(data.data).channelId === channelId) {
                    observer.next(JSON.parse(data.data))
                    return data
                }
            })
        })
    }

    /************ Chat ****************/

    listenToChatMessages(): Observable<any> {
        return new Observable((observer) => {
            this.apiSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `message-received`) {
                    observer.next(JSON.parse(data.data))
                }
            })
        })
    }

    emitChatMessage({ source1, source2, message }) {
        this.apiSocket.send(JSON.stringify({ eventName: `message-sent`, source1, source2, message }))
    }

    listenToChatTyping(): Observable<any> {
        return new Observable((observer) => {
            this.apiSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `chat-typing`) {
                    observer.next(JSON.parse(data.data))
                }
            })
        })
    }

    emitChatTypingByUser(userId) {
        this.apiSocket.send(
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
    //         this.channelSocket.addEventListener(`message`, (data) => {
    //             const parsedData = JSON.parse(data.data)
    //             switch (parsedData.eventName) {
    //                 case `channel-message-${channelId}`:
    //                     observer.next(JSON.parse(parsedData))
    //                     break
    //             }
    //         })
    //     })
    // }

    listenToChannelMessage(channelId): Observable<any> {
        return new Observable((observer) => {
            this.channelSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `channel-message-${channelId}`) {
                    observer.next(JSON.parse(data.data))
                }
            })
        })
    }

    emitChannelSubscribeByUser(channelId, userId) {
        this.channelSocket.send(
            JSON.stringify({
                eventName: `channel-subscribe`,
                channel: channelId,
                userId: userId
            })
        )
        debugger
    }

    emitMessageToChannel(channelId, message) {
        this.channelSocket.send(
            JSON.stringify({ eventName: `channel-message`, channel: channelId, message })
        )
    }

    emitDeleteMessageToChannel(channelId, message) {
        this.channelSocket.send(
            JSON.stringify({
                eventName: `delete-channel-message`,
                channel: channelId,
                message
            })
        )
    }

    emitDeleteAllMessagesToChannel(channelId) {
        this.channelSocket.send(
            JSON.stringify({ eventName: `delete-all-channel-messages`, channel: channelId })
        )
    }

    emitHistoryToChannel(channelId, skip) {
        this.channelSocket.send(
            JSON.stringify({
                eventName: `channel-message-history`,
                channel: channelId,
                skip
            })
        )
    }

    listenToChannelTyping(): Observable<any> {
        return new Observable((observer) => {
            this.channelSocket.addEventListener(`message`, (data) => {
                if (JSON.parse(data.data).eventName === `typing`) {
                    observer.next(JSON.parse(data.data))
                }
            })
        })
    }

    emitChannelChatTypingByUser(channelId, typingUser) {
        this.channelSocket.send(
            JSON.stringify({
                eventName: `channel-chat-typing`,
                channel: channelId,
                typingUser
            })
        )
    }

    /************ Channel streaming ****************/

    listenToRoomMemberUpdate({ channelId }): Observable<any> {
        return new Observable((observer) => {
            this.channelSocket.addEventListener(`message`, (data) => {
                const parsedData = JSON.parse(data.data)
                if (parsedData.eventName === `channel-streaming-room-member-update-${channelId}`) {
                    console.log("parsedData", parsedData)
                    observer.next(parsedData)
                }
            })
        })
    }

    emitRoomMemberUpdate({ channelId, userData, isNewUser }) {
        this.channelSocket.send(
            JSON.stringify({
                eventName: 'channel-streaming-room-member-update',
                channel: channelId,
                userData,
                isNewUser
            })
        )
    }

    listenToUserActions({ channelId }): Observable<any> {
        return new Observable((observer) => {
            this.channelSocket.addEventListener(`message`, (data) => {
                const parsedData = JSON.parse(data.data)
                if (parsedData.eventName === `channel-streaming-user-actions-${channelId}`) {
                    console.log("parsedData", parsedData)
                    observer.next(parsedData)
                }
            })
        })
    }

    emitUserActions({ channelId, userData, message }) {
        this.channelSocket.send(
            JSON.stringify({
                eventName: `channel-streaming-user-actions`,
                channel: channelId,
                userData,
                message
            })
        )
    }

    emitReactToMessage(channelId: string, message: Object, user: Object, reaction: string) {
        this.channelSocket.send(
            JSON.stringify({
                eventName: `react-to-message`,
                channel: channelId,
                message,
                user,
                reaction
            })
        )
    }
}

export const socketStore = new SocketStore()