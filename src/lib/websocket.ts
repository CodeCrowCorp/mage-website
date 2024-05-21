import { env } from '$env/dynamic/public'

const initChannelSocket = ({ channelId }: { channelId: number }) => {
	return new WebSocket(`${env.PUBLIC_WEBSOCKET_URL}/wsinit/channelid/${channelId}/connect`)
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
	channelId: number
	hostId: number
	userId: number
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

const emitMessageToChannel = ({
	channelSocket,
	channelId,
	hostId,
	platforms = [],
	message
}: {
	channelSocket: WebSocket
	channelId: number
	hostId: number
	platforms?: string[]
	message: any
}) => {
	platforms = platforms.map((platform: any) => platform.name.toLowerCase())
	channelSocket.send(
		JSON.stringify({ eventName: `channel-message`, channelId, hostId, platforms, message })
	)
}

const emitDeleteMessageToChannel = ({
	channelSocket,
	channelId,
	message
}: {
	channelSocket: WebSocket
	channelId: number
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
	channelId: number
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
	channelId: number
	limit: number
	cursor?: string
}) => {
	channelSocket.send(
		JSON.stringify({
			eventName: `channel-message-history`,
			channelId,
			limit,
			cursor
		})
	)
}

const emitReactToMessage = ({
	channelSocket,
	channelId,
	message,
	user,
	reaction
}: {
	channelSocket: WebSocket
	channelId: number
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
	initChannelSocket,
	emitChannelUpdate,
	emitChannelSubscribeByUser,
	emitMessageToChannel,
	emitReactToMessage,
	emitDeleteMessageToChannel,
	emitDeleteAllMessagesToChannel,
	emitChatHistoryToChannel,
	emitGetConnectedUsers,
	emitGetSponsors
}
