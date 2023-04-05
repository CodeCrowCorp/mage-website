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

function emitRemovedUser({ channelId, userId }: { channelId: string; userId: string }) {
	channelSocket.send(JSON.stringify({ eventName: `user-removed`, channelId, userId }))
}

function emitChannelUpdate({ channel }: { channel: any }) {
	channelSocket.send(JSON.stringify({ eventName: `channel-update`, channel }))
}

function emitChannelSubscribeByUser({ channelId, userId }: { channelId: string; userId: string }) {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-subscribe`,
			channelId: channelId,
			user: userId
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

// function listenToUserConnection({ userId }: { userId: string }) {
// 	platformMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `user-connection-${userId}`) {
// 			//parsedData.user
// 		}
// 	})
// }

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

// function listenToVideoRecordingStarted({ channelId }: { channelId: string }) {
// 	platformMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `video-recording-started` && parsedData.channelId === channelId) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToCompositionStatusUpdate({ channelId }: { channelId: string }) {
// 	platformMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (
// 			parsedData.eventName === `composition-status-update` &&
// 			parsedData.channelId === channelId
// 		) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToCompositionDeleted({ channelId }: { channelId: string }) {
// 	platformMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `composition-deleted` && parsedData.channelId === channelId) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToChatMessages() {
// 	platformMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `message-received`) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToChatTyping() {
// 	platformMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `chat-typing`) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToRemovedUser({ channelId }: { channelId: string }) {
// 	channelMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `user-removed-${channelId}`) {
// 			//parsedData.userId
// 		}
// 	})
// }

// function listenToChannelUpdate({ channelId }: { channelId: string }) {
// 	channelMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `channel-update-${channelId}`) {
// 			// channelService.currentChannel.description = parsedData.channel.description
// 			// channelService.currentChannel.thumbnail = parsedData.channel.thumbnail
// 			// channelService.currentChannel.isPrivate = parsedData.channel.isPrivate
// 			// channelService.currentChannel.attachments = parsedData.channel.attachments
// 		}
// 	})
// }

// function listenToChannelMessage({ channelId }: { channelId: string }) {
// 	channelMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `channel-message-${channelId}`) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToChannelTyping() {
// 	channelMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `typing`) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToRoomMemberUpdate({ channelId }: { channelId: string }) {
// 	channelMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `channel-streaming-room-member-update-${channelId}`) {
// 			console.log('parsedData', parsedData)
// 		}
// 	})
// }

// function listenToUserActions({ channelId }: { channelId: string }) {
// 	channelMessage.subscribe((value) => {
// 		const parsedData = JSON.parse(value.data)
// 		if (parsedData.eventName === `channel-streaming-user-actions-${channelId}`) {
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
	emitRemovedUser,
	emitChannelUpdate,
	emitChannelSubscribeByUser,
	emitMessageToChannel,
	emitReactToMessage,
	emitDeleteMessageToChannel,
	emitDeleteAllMessagesToChannel,
	emitChatHistoryToChannel,
	// emitChannelChatTypingByUser,
	emitAction
}
