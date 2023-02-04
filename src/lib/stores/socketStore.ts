import { env } from '$env/dynamic/public'
import { writable, type Writable } from 'svelte/store'

let platformSocket: WebSocket
let channelSocket: WebSocket

export const platformConnection: Writable<string> = writable()
export const channelConnection: Writable<string> = writable()
export const platformMessage: Writable<MessageEvent> = writable()
export const channelMessage: Writable<MessageEvent> = writable()

async function getPlatformSocket() {
	return await fetch(`${env.PUBLIC_API_URL}/wsinit/wsid`, {
		method: 'GET'
	}).then(async (response) => {
		const data = await response.text()
		await setupWebsocketConnection({ websocketId: data, isChannelConnection: false })
	})
}

async function getChannelSocket({ channelId }: { channelId: string }) {
	return await fetch(`${env.PUBLIC_API_URL}/wsinit/channelid?channelId=${channelId}`, {
		method: 'GET'
	}).then(async (response) => {
		const data = await response.text()
		await setupWebsocketConnection({ websocketId: data, isChannelConnection: true })
	})
}

async function setupWebsocketConnection({
	websocketId,
	isChannelConnection
}: {
	websocketId: string
	isChannelConnection: boolean
}) {
	if (!isChannelConnection) {
		platformSocket = new WebSocket(`${env.PUBLIC_WEBSOCKET_URL}/wsinit/wsid/${websocketId}/connect`)
		platformSocket?.addEventListener('open', (data) => {
			console.log('socket connection open')
			console.log(data)
			platformConnection.set('open')
		})
		platformSocket?.addEventListener('message', (data) => {
			console.log('listening to messages')
			console.log(data)
			platformMessage.set(data)
		})
		platformSocket?.addEventListener('error', (data) => {
			console.log('socket connection error')
			console.log(data)
		})
		platformSocket?.addEventListener('close', (data) => {
			console.log('socket connection close')
			console.log(data)
			platformConnection.set('close')
		})
	} else {
		channelSocket = new WebSocket(
			`${env.PUBLIC_WEBSOCKET_URL}/wsinit/channelid/${websocketId}/connect`
		)
		channelSocket?.addEventListener('open', (data) => {
			console.log('channel socket connection open')
			console.log(data)
			channelConnection.set('open')
		})
		channelSocket?.addEventListener('message', (data) => {
			console.log('listening to messages')
			console.log(data)
			channelMessage.set(data)
		})
		channelSocket?.addEventListener('error', (data) => {
			console.log('socket connection error')
			console.log(data)
		})
		channelSocket?.addEventListener('close', (data) => {
			console.log('socket connection close')
			console.log(data)
			channelConnection.set('close')
		})
	}
}

function emitUserConnection({ userId, isOnline }: { userId: string; isOnline: boolean }) {
	platformSocket?.send(
		JSON.stringify({ eventName: isOnline ? 'user-connect' : 'user-disconnect', userId: userId })
	)
}

function emitRemovedUser({ channelId, userId }: { channelId: string; userId: string }) {
	channelSocket?.send(JSON.stringify({ eventName: `user-removed`, channelId, userId }))
}

function emitChannelUpdate({ channelId }: { channelId: string }) {
	channelSocket?.send(JSON.stringify({ eventName: `channel-update`, channelId }))
}

function emitChannelAccessRequest({ channelId, userId }: { channelId: string; userId: string }) {
	platformSocket?.send(
		JSON.stringify({ eventName: `channel-access-request`, channel: channelId, user: userId })
	)
}

function emitChannelAccessResponse({
	channelId,
	userId,
	isGrantedAccess
}: {
	channelId: string
	userId: string
	isGrantedAccess: boolean
}) {
	platformSocket?.send(
		JSON.stringify({
			eventName: `channel-access-response`,
			channel: channelId,
			user: userId,
			isGrantedAccess
		})
	)
}

/************ Chat ****************/

function emitChatMessage({
	source1,
	source2,
	message
}: {
	source1: string
	source2: string
	message: any
}) {
	platformSocket?.send(JSON.stringify({ eventName: `message-sent`, source1, source2, message }))
}

function emitChatTypingByUser({ userId }: { userId: string }) {
	platformSocket?.send(
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
//         channelSocket?.addEventListener(`message`, (data) => {
//             const parsedData = JSON.parse(data.data)
//             switch (parsedData.eventName) {
//                 case `channel-message-${channelId}`:
//                     observer.next(JSON.parse(parsedData))
//                     break
//             }
//         })
//     })
// }

function emitChannelSubscribeByUser({ channelId, userId }: { channelId: string; userId: string }) {
	channelSocket?.send(
		JSON.stringify({
			eventName: `channel-subscribe`,
			channel: channelId,
			userId: userId
		})
	)
}

function emitMessageToChannel({ channelId, message }: { channelId: string; message: any }) {
	channelSocket?.send(JSON.stringify({ eventName: `channel-message`, channel: channelId, message }))
}

function emitDeleteMessageToChannel({
	channelId,
	message
}: {
	channelId: string
	message: string
}) {
	channelSocket?.send(
		JSON.stringify({
			eventName: `delete-channel-message`,
			channel: channelId,
			message
		})
	)
}

function emitDeleteAllMessagesToChannel({ channelId }: { channelId: string }) {
	channelSocket?.send(
		JSON.stringify({ eventName: `delete-all-channel-messages`, channel: channelId })
	)
}

function emitHistoryToChannel({ channelId, skip }: { channelId: string; skip: number }) {
	channelSocket?.send(
		JSON.stringify({
			eventName: `channel-message-history`,
			channel: channelId,
			skip
		})
	)
}

function emitChannelChatTypingByUser({
	channelId,
	typingUser
}: {
	channelId: string
	typingUser: string
}) {
	channelSocket?.send(
		JSON.stringify({
			eventName: `channel-chat-typing`,
			channel: channelId,
			typingUser
		})
	)
}

/************ Channel streaming ****************/

function emitRoomMemberUpdate({
	channelId,
	userData,
	isNewUser
}: {
	channelId: string
	userData: any
	isNewUser: boolean
}) {
	channelSocket?.send(
		JSON.stringify({
			eventName: 'channel-streaming-room-member-update',
			channel: channelId,
			userData,
			isNewUser
		})
	)
}

function emitUserActions({
	channelId,
	userData,
	message
}: {
	channelId: string
	userData: any
	message: string
}) {
	channelSocket?.send(
		JSON.stringify({
			eventName: `channel-streaming-user-actions`,
			channel: channelId,
			userData,
			message
		})
	)
}

function emitReactToMessage({
	channelId,
	message,
	user,
	reaction
}: {
	channelId: string
	message: any
	user: any
	reaction: string
}) {
	channelSocket?.send(
		JSON.stringify({
			eventName: `react-to-message`,
			channel: channelId,
			message,
			user,
			reaction
		})
	)
}

/************ Recording ****************/

// function emitVideoRecordingStarted({ channelId }: { channelId: string }) {
// 	platformSocket?.send(JSON.stringify({ eventName: `video-recording-started`, channelId }))
// }

// function emitVideoRecordingEnded({
// 	channelId,
// 	sessionCounter
// }: {
// 	channelId: string
// 	sessionCounter: number
// }) {
// 	platformSocket?.send(
// 		JSON.stringify({ eventName: 'video-recording-ended', channelId, sessionCounter })
// 	)
// }

// function emitCompositionDeleted({
// 	channelId,
// 	compositionSid
// }: {
// 	channelId: string
// 	compositionSid: string
// }) {
// 	platformSocket?.send(
// 		JSON.stringify({ eventName: 'composition-deleted', channelId, compositionSid })
// 	)
// }

//TODO: place these everywhere we are using socket listeners

function listenToUserConnection({ userId }: { userId: string }) {
	platformMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `user-connection-${userId}`) {
			//parsedData.user
		}
	})
}

function listenToRemovedUser({ channelId }: { channelId: string }) {
	channelMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `user-removed-${channelId}`) {
			//parsedData.userId
		}
	})
}

function listenToChannelUpdate({ channelId }: { channelId: string }) {
	channelMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `channel-update-${channelId}`) {
			// channelService.currentChannel.description = parsedData.channel.description
			// channelService.currentChannel.thumbnail = parsedData.channel.thumbnail
			// channelService.currentChannel.isPrivate = parsedData.channel.isPrivate
			// channelService.currentChannel.attachments = parsedData.channel.attachments
		}
	})
}

function listenToChannelAccessRequest({ channelId }: { channelId: string }) {
	platformMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `channel-access-request` && parsedData.channelId === channelId) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToChannelAccessResponse({ channelId }: { channelId: string }) {
	platformMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `channel-access-response` && parsedData.channelId === channelId) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToVideoRecordingStarted({ channelId }: { channelId: string }) {
	platformMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `video-recording-started` && parsedData.channelId === channelId) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToCompositionStatusUpdate({ channelId }: { channelId: string }) {
	platformMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (
			parsedData.eventName === `composition-status-update` &&
			parsedData.channelId === channelId
		) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToCompositionDeleted({ channelId }: { channelId: string }) {
	platformMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `composition-deleted` && parsedData.channelId === channelId) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToChatMessages() {
	platformMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `message-received`) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToChatTyping() {
	platformMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `chat-typing`) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToChannelMessage({ channelId }: { channelId: string }) {
	channelMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `channel-message-${channelId}`) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToChannelTyping() {
	channelMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `typing`) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToRoomMemberUpdate({ channelId }: { channelId: string }) {
	channelMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `channel-streaming-room-member-update-${channelId}`) {
			console.log('parsedData', parsedData)
		}
	})
}

function listenToUserActions({ channelId }: { channelId: string }) {
	channelMessage.subscribe((value) => {
		const parsedData = JSON.parse(value.data)
		if (parsedData.eventName === `channel-streaming-user-actions-${channelId}`) {
			console.log('parsedData', parsedData)
		}
	})
}

export {
	getPlatformSocket,
	getChannelSocket,
	emitUserConnection,
	emitRemovedUser,
	emitChannelUpdate,
	emitChannelAccessRequest,
	emitChannelAccessResponse,
	emitChatMessage,
	emitChatTypingByUser,
	emitChannelSubscribeByUser,
	emitMessageToChannel,
	emitDeleteMessageToChannel,
	emitDeleteAllMessagesToChannel,
	emitHistoryToChannel,
	emitChannelChatTypingByUser,
	emitRoomMemberUpdate,
	emitUserActions,
	emitReactToMessage
	// emitVideoRecordingStarted,
	// emitVideoRecordingEnded,
	// emitCompositionDeleted
}
