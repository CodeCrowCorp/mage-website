import { env } from '$env/dynamic/public'

let platformSocket: WebSocket
let channelSocket: WebSocket

function initPlatformSocket(websocketId: string) {
	platformSocket = new WebSocket(`${env.PUBLIC_WEBSOCKET_URL}/wsinit/wsid/${websocketId}/connect`)
}

function initChannelSocket(websocketId: string) {
	channelSocket = new WebSocket(
		`${env.PUBLIC_WEBSOCKET_URL}/wsinit/channelid/${websocketId}/connect`
	)
}

function emitUserConnection({ userId, isOnline }: { userId: string; isOnline: boolean }) {
	platformSocket.send(
		JSON.stringify({ eventName: isOnline ? 'user-connect' : 'user-disconnect', userId: userId })
	)
}

// function emitChannelAccessRequest({ channelId, userId }: { channelId: string; userId: string }) {
// 	platformSocket.send(
// 		JSON.stringify({ eventName: `channel-access-request`, channel: channelId, user: userId })
// 	)
// }

// function emitChannelAccessResponse({
// 	channelId,
// 	userId,
// 	isGrantedAccess
// }: {
// 	channelId: string
// 	userId: string
// 	isGrantedAccess: boolean
// }) {
// 	platformSocket.send(
// 		JSON.stringify({
// 			eventName: `channel-access-response`,
// 			channel: channelId,
// 			user: userId,
// 			isGrantedAccess
// 		})
// 	)
// }

/************ Chat ****************/

// function emitChatMessage({
// 	source1,
// 	source2,
// 	message
// }: {
// 	source1: string
// 	source2: string
// 	message: any
// }) {
// 	platformSocket.send(JSON.stringify({ eventName: `message-sent`, source1, source2, message }))
// }

// function emitChatTypingByUser({ userId }: { userId: string }) {
// 	platformSocket.send(
// 		JSON.stringify({
// 			eventName: `chat-typing`,
// 			user: userId,
// 			isTyping: true
// 		})
// 	)
// }

/************ Channel chat ****************/

function emitChannelUpdate({ channel }: { channel: any }) {
	channelSocket.send(JSON.stringify({ eventName: `channel-update`, channel }))
}

function emitChannelSubscribeByUser({
	channelId,
	userId,
	username
}: {
	channelId: string
	userId: string
	username: string
}) {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-subscribe`,
			channel: channelId,
			user: { userId, username }
		})
	)
}

function emitMessageToChannel({ channelId, message }: { channelId: string; message: any }) {
	channelSocket.send(JSON.stringify({ eventName: `channel-message`, channel: channelId, message }))
}

function emitDeleteMessageToChannel({
	channelId,
	message
}: {
	channelId: string
	message: string
}) {
	channelSocket.send(
		JSON.stringify({
			eventName: `delete-channel-message`,
			channel: channelId,
			message
		})
	)
}

function emitDeleteAllMessagesToChannel({ channelId }: { channelId: string }) {
	channelSocket.send(
		JSON.stringify({ eventName: `delete-all-channel-messages`, channel: channelId })
	)
}

function emitChatHistoryToChannel({ channelId, skip }: { channelId: string; skip: number }) {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-message-history`,
			channel: channelId,
			skip
		})
	)
}

// function emitChannelChatTypingByUser({
// 	channelId,
// 	typingUser
// }: {
// 	channelId: string
// 	typingUser: string
// }) {
// 	channelSocket.send(
// 		JSON.stringify({
// 			eventName: `channel-chat-typing`,
// 			channel: channelId,
// 			typingUser
// 		})
// 	)
// }

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
	channelSocket.send(
		JSON.stringify({
			eventName: `react-to-message`,
			channel: channelId,
			message,
			user,
			reaction
		})
	)
}

/************ Channel streaming ****************/

function emitAction({ channelId, message }: { channelId: string; message: any }) {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-streaming-action`,
			channel: channelId,
			message
		})
	)
}

// function listenToChannelAccessRequest({ channelId }: { channelId: string }) {
// 	platformMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `channel-access-request` && parsedData.channelId === channelId) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToChannelAccessResponse({ channelId }: { channelId: string }) {
// 	platformMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `channel-access-response` && parsedData.channelId === channelId) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

export {
	channelSocket,
	platformSocket,
	initPlatformSocket,
	initChannelSocket,
	emitUserConnection,
	// emitChannelAccessRequest,
	// emitChannelAccessResponse,
	// emitChatMessage,
	// emitChatTypingByUser,
	emitChannelUpdate,
	emitChannelSubscribeByUser,
	emitMessageToChannel,
	emitReactToMessage,
	emitDeleteMessageToChannel,
	emitDeleteAllMessagesToChannel,
	emitChatHistoryToChannel,
	emitAction
}
