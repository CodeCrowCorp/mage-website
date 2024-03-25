import { env } from '$env/dynamic/public'

// let platformSocket: WebSocket
// const initPlatformSocket = ({ websocketId }: { websocketId: string }) => {
// 	platformSocket = new WebSocket(`${env.PUBLIC_WEBSOCKET_URL}/wsinit/wsid/${websocketId}/connect`)
// }
// const emitUserConnection = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
// 	platformSocket.send(
// 		JSON.stringify({ eventName: isOnline ? 'user-connect' : 'user-disconnect', userId: userId })
// 	)
// }

const initChannelSocket = ({ websocketId }: { websocketId: string }) => {
	return new WebSocket(`${env.PUBLIC_WEBSOCKET_URL}/wsinit/channelid/${websocketId}/connect`)
}

const emitChannelPing = ({
	channelSocket,
	channelId
}: {
	channelSocket: WebSocket
	channelId: string
}) => {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-ping`,
			channelId
		})
	)
}

const emitChannelUpdate = ({
	channelSocket,
	channel,
	roleUpdate
}: {
	channelSocket: WebSocket
	channel: any
	roleUpdate?: any
}) => {
	const noSocketChannel = { ...channel }
	delete noSocketChannel.socket
	delete noSocketChannel.videoItems
	delete noSocketChannel.isOnboarded
	channelSocket.send(
		JSON.stringify({ eventName: `channel-update`, channel: noSocketChannel, roleUpdate })
	)
}

const emitChannelSubscribeByUser = ({
	channelSocket,
	channelId,
	hostId,
	userId,
	username
}: {
	channelSocket: WebSocket
	channelId: string
	hostId: string
	userId: string
	username: string
}) => {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-subscribe`,
			channelId,
			hostId,
			user: { userId, username }
		})
	)
}
const emitPlatformCount = ({
	channelSocket,
	channelId,
	hostId
}: {
	channelSocket: WebSocket
	channelId: string
	hostId: string
}) => {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-platform-count`,
			channelId,
			hostId
		})
	)
}
const emitPlatformChat = ({
	channelSocket,
	channelId,
	hostId
}: {
	channelSocket: WebSocket
	channelId: string
	hostId: string
}) => {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-platform-chat`,
			channelId,
			hostId
		})
	)
}

const emitMessageToChannel = ({
	channelSocket,
	channelId,
	message
}: {
	channelSocket: WebSocket
	channelId: string
	message: any
}) => {
	channelSocket.send(JSON.stringify({ eventName: `channel-message`, channelId, message }))
}

const emitDeleteMessageToChannel = ({
	channelSocket,
	channelId,
	message
}: {
	channelSocket: WebSocket
	channelId: string
	message: string
}) => {
	channelSocket.send(
		JSON.stringify({
			eventName: `delete-channel-message`,
			channelId,
			message
		})
	)
}

const emitDeleteAllMessagesToChannel = ({
	channelSocket,
	channelId
}: {
	channelSocket: WebSocket
	channelId: string
}) => {
	channelSocket.send(JSON.stringify({ eventName: `delete-all-channel-messages`, channelId }))
}

const emitChatHistoryToChannel = ({
	channelSocket,
	channelId,
	limit,
	cursor
}: {
	channelSocket: WebSocket
	channelId: string
	limit: number
	cursor?: string
}) => {
	if (!cursor) {
		channelSocket.send(
			JSON.stringify({
				eventName: `channel-message-history`,
				channelId,
				limit
			})
		)
	} else {
		channelSocket.send(
			JSON.stringify({
				eventName: `channel-message-history`,
				channelId,
				limit,
				cursor
			})
		)
	}
}

const emitReactToMessage = ({
	channelSocket,
	channelId,
	message,
	user,
	reaction
}: {
	channelSocket: WebSocket
	channelId: string
	message: any
	user: any
	reaction: string
}) => {
	channelSocket.send(
		JSON.stringify({
			eventName: `react-to-message`,
			channelId,
			message,
			user,
			reaction
		})
	)
}

const emitGetConnectedUsers = ({
	channelSocket,
	cursor
}: {
	channelSocket: WebSocket
	cursor: number
}) => {
	channelSocket?.send(
		JSON.stringify({
			eventName: `channel-get-users`,
			cursor
		})
	)
}

const emitGetSponsors = ({
	channelSocket,
	recipientUserId,
	channelId
}: {
	channelSocket: WebSocket
	recipientUserId: number
	channelId: number
}) => {
	channelSocket?.send(
		JSON.stringify({
			eventName: `channel-get-sponsors`,
			recipientUserId,
			channelId
		})
	)
}

export {
	// initPlatformSocket,
	// emitUserConnection,
	initChannelSocket,
	emitChannelPing,
	emitChannelUpdate,
	emitChannelSubscribeByUser,
	emitPlatformCount,
	emitMessageToChannel,
	emitReactToMessage,
	emitDeleteMessageToChannel,
	emitDeleteAllMessagesToChannel,
	emitChatHistoryToChannel,
	emitGetConnectedUsers,
	emitGetSponsors,
	emitPlatformChat
}
