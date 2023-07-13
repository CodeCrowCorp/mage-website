import { env } from '$env/dynamic/public'

let platformSocket: WebSocket

const initPlatformSocket = ({ websocketId }: { websocketId: string }) => {
	platformSocket = new WebSocket(`${env.PUBLIC_WEBSOCKET_URL}/wsinit/wsid/${websocketId}/connect`)
}

const emitUserConnection = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
	platformSocket.send(
		JSON.stringify({ eventName: isOnline ? 'user-connect' : 'user-disconnect', userId: userId })
	)
}

const initChannelSocket = ({ websocketId }: { websocketId: string }) => {
	return new WebSocket(`${env.PUBLIC_WEBSOCKET_URL}/wsinit/channelid/${websocketId}/connect`)
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
	channelSocket.send(
		JSON.stringify({ eventName: `channel-update`, channel: noSocketChannel, roleUpdate })
	)
}

const emitChannelSubscribeByUser = ({
	channelSocket,
	channelId,
	userId,
	username
}: {
	channelSocket: WebSocket
	channelId: string
	userId: string
	username: string
}) => {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-subscribe`,
			channel: channelId,
			user: { userId, username }
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
	channelSocket.send(JSON.stringify({ eventName: `channel-message`, channel: channelId, message }))
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
			channel: channelId,
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
	channelSocket.send(
		JSON.stringify({ eventName: `delete-all-channel-messages`, channel: channelId })
	)
}

const emitChatHistoryToChannel = ({
	channelSocket,
	channelId,
	skip,
	cursor
}: {
	channelSocket: WebSocket
	channelId: string
	skip: number
	cursor?: string
}) => {
	if (!cursor) {
		channelSocket.send(
			JSON.stringify({
				eventName: `channel-message-history`,
				channel: channelId,
				skip
			})
		)
	} else {
		channelSocket.send(
			JSON.stringify({
				eventName: `channel-message-history`,
				channel: channelId,
				skip,
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
			channel: channelId,
			message,
			user,
			reaction
		})
	)
}

const emitAction = ({
	channelSocket,
	channelId,
	message
}: {
	channelSocket: WebSocket
	channelId: string
	message: any
}) => {
	channelSocket?.send(
		JSON.stringify({
			eventName: `channel-streaming-action`,
			channel: channelId,
			message
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

export {
	platformSocket,
	initPlatformSocket,
	initChannelSocket,
	emitUserConnection,
	emitChannelUpdate,
	emitChannelSubscribeByUser,
	emitMessageToChannel,
	emitReactToMessage,
	emitDeleteMessageToChannel,
	emitDeleteAllMessagesToChannel,
	emitChatHistoryToChannel,
	emitAction,
	emitGetConnectedUsers
}
