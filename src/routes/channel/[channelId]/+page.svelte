<script lang="ts">
	import DrawerChat from '$lib/components/Channel/Chat/DrawerChat.svelte'
	import StreamContainer from '$lib/components/Channel/Stream/StreamContainer.svelte'
	import { onDestroy, onMount } from 'svelte'
	import { get, del, post } from '$lib/api'
	import {
		emitChatHistoryToChannel,
		initChannelSocket,
		emitChannelSubscribeByUser,
		emitDeleteAllMessagesToChannel,
		emitGetSponsors,
		emitMessageToChannel
	} from '$lib/websocket'
	import { channel_connection, channel_message } from '$lib/stores/websocketStore'
	import { isJsonString, updateVideoItems } from '$lib/utils'
	import { is_chat_drawer_open, is_chat_drawer_destroy } from '$lib/stores/channelStore'
	import Modal from '$lib/components/Global/Modal.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import DrawerEditChannel from '$lib/components/Channel/Chat/DrawerEditChannel.svelte'
	import { is_sharing_screen, is_sharing_webcam, is_sharing_audio } from '$lib/stores/streamStore'
	import DrawerRestream from '$lib/components/Channel/Chat/DrawerRestream.svelte'
	import DialogSponsor from '$lib/components/Channel/Chat/DialogSponsor.svelte'
	import { is_feature_premium_enabled } from '$lib/stores/remoteConfigStore'

	let channel: any,
		isDeleteModalOpen = false,
		showEditChannelDrawer = false,
		channels: any = [],
		lastId = 0,
		limit = 10,
		viewers: any[] = [],
		chatHistory: any[] = [],
		youtubeChatPageToken: any = null,
		platformPollingInterval: any

	$: userCount = 0
	$: isHostOrGuest =
		channel?.userId === $page.data.user?.userId ||
		channel?.guests?.includes($page.data.user?.userId)

	$: if (channel) {
		if (channel._id !== parseInt(channelId)) {
			disableSharing()
			handleWebsocket()
			timeoutConnection()
		}
	}

	$: isLive = channel?.videoItems?.some((input: any) => input?.rtmps?.isConnected) ?? false
	$: channelId = $page.params.channelId

	onMount(async () => {
		clearInterval(platformPollingInterval)
		platformPollingInterval = null
		await loadChannel()
		await handleWebsocket()
		await loadMoreChannels()
		$is_chat_drawer_destroy = false
		setTimeout(() => {
			$is_chat_drawer_open = true
		}, 600)

		channel_message.subscribe(async (value: any) => {
			if (!value || (channel && parseInt(channelId) !== channel._id)) return
			var parsedMsg = JSON.parse(value)
			switch (parsedMsg.eventName) {
				case `channel-update-${channelId}`:
					console.log('channel-update', parsedMsg)
					channel = {
						...parsedMsg.channel,
						socket: channel.socket,
						videoItems: channel.videoItems,
						isOnboarded: channel.isOnboarded
					}
					if (parsedMsg.roleUpdate) {
						switch (parsedMsg.roleUpdate.roleEvent) {
							case 'ban':
								if (parsedMsg.roleUpdate.isEnabled) {
									channel.videoItems = channel.videoItems.filter(
										(video: any) => video._id !== parsedMsg.roleUpdate.userId
									)
								}
								break
							case 'guest':
								if (parsedMsg.roleUpdate.isEnabled) {
									channel.videoItems.push(parsedMsg.roleUpdate.user)
									channel.videoItems = channel.videoItems
								} else {
									channel.videoItems = channel.videoItems.filter(
										(video: any) => video._id !== parsedMsg.roleUpdate.userId
									)
								}
								break
						}
					}
					break
				case `channel-subscribe-${channelId}`:
					userCount = parsedMsg.userCount
					if (parsedMsg.quitUserId) {
						channel.videoItems = channel.videoItems.filter(
							(video: any) => video._id !== parsedMsg.quitUserId
						)
						console.log('channel.videoItems on quit : ', channel.videoItems)
					} else {
						const activeGuests = parsedMsg.activeGuests
						if (activeGuests?.length) {
							if (channel.videoItems?.length) {
								// for users that are in the channel and new users join
								// add new users but dont overwrite the existing ones streaming
								channel.videoItems = activeGuests.map((guest: any) => {
									const foundVideoItem = channel.videoItems.find(
										(video: any) => guest._id === video._id
									)
									return foundVideoItem || guest
								})
							} else {
								// for new users joining the channel
								const liveInputs = await get(`live-inputs?channelId=${channelId}`)
								channel.videoItems = updateVideoItems([...activeGuests], liveInputs)
							}
						}
					}
					break
				case `channel-streaming-action-${channelId}`:
					if (channel) {
						channel.videoItems = updateVideoItems(channel.videoItems, [parsedMsg.data.video])
					}
					break
				case `channel-get-sponsors-${channelId}`:
					if (channel) {
						channel.sponsors = parsedMsg.sponsors
					}
					break
			}
		})
	})

	onDestroy(async () => {
		channelId = ''
		clearInterval(platformPollingInterval)
		platformPollingInterval = null
		disableSharing()
		channels.forEach((ch: any) => {
			if (ch.socket && ch.socket.constructor === WebSocket) {
				console.log('got here----', ch.socket)
				ch.socket.close()
			}
		})
	})

	const disableSharing = () => {
		if (isHostOrGuest) {
			if ($is_sharing_screen) $is_sharing_screen = false
			if ($is_sharing_webcam) $is_sharing_webcam = false
			if ($is_sharing_audio) $is_sharing_audio = false
		}
	}

	const loadChannel = async () => {
		const chan = await get(`channel?channelId=${channelId}`)
		chan.videoItems = []
		const isOnboarded = await get(`plan/onboarded?userId=${chan.userId}`)
		chan.isOnboarded = isOnboarded || false
		const sponsors = await get(`plan/sponsors?userId=${chan.userId}`)
		chan.sponsors = sponsors || []
		channels.push(chan)
	}

	const initChannel = (chan: any) => {
		$channel_connection = `open-${channelId}`
		$channel_message = ''
		chan.videoItems = []
		clearInterval(platformPollingInterval)
		platformPollingInterval = null
		if (chan.socket?.readyState === WebSocket.OPEN) {
			emitChannelSubscribeByUser({
				channelSocket: chan.socket,
				channelId: channelId,
				hostId: chan.userId,
				userId: $page.data.user?.userId,
				username: $page.data.user?.user?.username
			})
			emitChatHistoryToChannel({
				channelSocket: chan.socket,
				channelId: channelId,
				limit: 100
			})
			platformPollingInterval = setInterval(async () => {
				if (isLive) {
					await getPlatformCount()
					await getPlatformChatYouTube()
				}
			}, 5000)
			const hasSponsors = $page.url?.searchParams?.get('hasSponsors') || ''
			if (hasSponsors) {
				emitGetSponsors({
					channelSocket: chan.socket,
					recipientUserId: chan.userId,
					channelId: chan._id
				})
				goto(`/channel/${channelId}`, {
					replaceState: true
				})
			}
		}
	}

	const insertChannelView = async (channel: any) => {
		if ($page.data.user?.userId && channel?.userId !== $page.data.user?.userId) {
			await post(
				`analytics/view`,
				{
					viewType: 'channel',
					viewId: channel?._id
				},
				{
					userId: $page.data.user?.userId,
					token: $page.data.user?.token
				}
			)
		}
	}

	const handleWebsocket = async () => {
		try {
			channel = channels.find((ch: any) => ch._id === parseInt(channelId))
			await insertChannelView(channel)
			chatHistory = []
			isHostOrGuest =
				channel.userId === $page.data.user?.userId ||
				channel.guests?.includes($page.data.user?.userId)
			let channelSocketId = ''
			if (!channel.socket) {
				channelSocketId = await get(`wsinit/channelid?channelId=${channelId}`)
				if (channelSocketId) {
					channel.socket = initChannelSocket({ websocketId: channelSocketId })
				} else {
					attemptReconnect()
					return
				}
			} else {
				initChannel(channel)
			}
			if (channel.socket && channel.socket.constructor === WebSocket) {
				channel.socket.addEventListener('open', async (data: any) => {
					initChannel(channel)
				})
				channel.socket.addEventListener('message', (data: any) => {
					console.log('channel listening to messages')
					if (isJsonString(data.data)) {
						$channel_message = data.data
					}
				})
				channel.socket.addEventListener('error', (data: any) => {
					console.log('channel socket connection error')
					console.log(data)
					clearInterval(platformPollingInterval)
					platformPollingInterval = null
				})
				channel.socket.addEventListener('close', (data: any) => {
					console.log('channel socket connection close')
					console.log(data)

					//if manually closed, don't reconnect
					if (data.code === 1005) {
						clearInterval(platformPollingInterval)
						platformPollingInterval = null
						return
					}
					attemptReconnect()
				})
			}
		} catch (err) {
			if (err) attemptReconnect()
		}
	}

	const attemptReconnect = () => {
		setTimeout(async () => {
			if (!channelId) return
			console.log('Reconnecting to WebSocket...')
			channel = channels.find((ch: any) => ch._id === parseInt(channelId))
			if (channel) {
				channel.socket = null
				await handleWebsocket()
			}
		}, 4000)
	}

	const timeoutConnection = () => {
		const currentChannelIndex = channels.findIndex((ch: any) => ch._id === parseInt(channelId))
		channels.forEach((channel: any, index: number) => {
			if (
				Math.abs(index - currentChannelIndex) > 10 &&
				channel.socket &&
				channel.socket.constructor === WebSocket
			) {
				channel.socket.close()
			}
		})
	}

	const deleteChannelNoAction = () => {
		isDeleteModalOpen = false
	}

	const deleteChannelYesAction = async () => {
		await del(`channel?channelId=${channelId}&bucketName=thumbnails`, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		emitDeleteAllMessagesToChannel({
			channelSocket: channel.socket,
			channelId: channelId
		})
		goto('/browse')
	}

	const loadMoreChannels = async () => {
		let newchannels = await get(`channels?lastId=${lastId}&limit=${limit}`)
		//Remove duplicate channels
		newchannels = newchannels.filter(
			(newChannel: any) =>
				newChannel.isLive && !channels.some((channel: any) => channel?._id === newChannel?._id)
		)
		newchannels.forEach((channel: any) => {
			channel.videoItems = []
		})
		channels = [...channels, ...newchannels]
		lastId = newchannels[newchannels.length - 1]?._id
	}

	const getPlatformCount = async () => {
		// check if host's video and is connected
		const isConnectedUser = channel.videoItems.some(
			(videoItem: any) => videoItem._id === channel.userId
		)
		if (isConnectedUser) {
			channel.platforms = await get(`outputs/platforms?userId=${channel.userId}`)
		}
	}

	const getPlatformChatYouTube = async () => {
		if (
			channel.userId === $page.data.user?.userId &&
			isLive &&
			channel.platforms?.some((platform: any) => platform.name === 'YouTube')
		) {
			let url = `youtube/messages?userId=${channel.userId}`
			if (youtubeChatPageToken) {
				url += `&pageToken=${youtubeChatPageToken}`
			}
			const youtubeChat = await get(url)
			youtubeChat?.messages?.forEach((item: any) => {
				if (!chatHistory.some((chat) => chat.youtubeMessageId === item.id)) {
					emitMessageToChannel({
						channelSocket: channel.socket,
						channelId: channel._id,
						message: {
							isAiChatEnabled: false,
							body: item.message,
							platform: item.platform,
							youtubeMessageId: item.id,
							user: item.user
						}
					})
				}
			})
			youtubeChatPageToken = youtubeChat?.nextPageToken
		}
	}
</script>

{#key $page.url.pathname}
	{#if !$is_sharing_screen && !$is_sharing_webcam && !$is_sharing_audio && isHostOrGuest}
		<DrawerRestream bind:channelId />
	{/if}

	{#if channel && channel._id === parseInt(channelId)}
		<div class="relative h-full bg-base-200 overflow-hidden flex">
			<div
				class={'lg:ml-24 h-full transition-all delay-75 ' +
					(!$is_chat_drawer_open ? 'w-full' : 'with-drawer')}>
				<StreamContainer
					bind:channel
					bind:userCount
					bind:channels
					on:loadMore={loadMoreChannels}
					bind:isHostOrGuest
					bind:viewers
					bind:channelId />

				{#if showEditChannelDrawer}
					<DrawerEditChannel bind:channel bind:showDrawer={showEditChannelDrawer} />
				{/if}
			</div>
			{#if !$is_chat_drawer_destroy}
				<div
					class={'absolute right-0 top-0 ' + ($is_chat_drawer_open ? 'drawer-container' : 'w-0')}>
					<div class="drawer drawer-end">
						<input
							id="chat-drawer"
							type="checkbox"
							class="drawer-toggle"
							bind:checked={$is_chat_drawer_open} />
						<div class="drawer-side w-fit lg:absolute lg:right-0 lg:pb-0 pb-4">
							<label for="chat-drawer" class="drawer-overlay lg:hidden" />
							<div
								class="h-full pt-12 lg:p-5 md:w-fit lg:ml-0 md:ml-0 w-max-full mobile-margin lg:drop-shadow-lg">
								<DrawerChat bind:channel bind:showEditChannelDrawer bind:viewers {chatHistory} />
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<input
			type="checkbox"
			id="modal-delete-channel"
			class="modal-toggle"
			bind:checked={isDeleteModalOpen} />
		<Modal
			id="modal-delete-channel"
			title="Delete channel"
			message="Are you sure you want to delete this channel?"
			no="Cancel"
			noAction={deleteChannelNoAction}
			yes="Yes"
			yesAction={deleteChannelYesAction}
			isError={true} />
		{#if $is_feature_premium_enabled}
			<DialogSponsor profile={{ _id: channel.userId, username: channel.username }} />
		{/if}
	{/if}
{/key}

<style>
	.with-drawer {
		width: calc(100% - 500px);
	}
	@media screen and (max-width: 1020px) {
		.with-drawer {
			width: 100%;
		}
	}

	.drawer-container {
		width: 410px;
		max-width: 100%;
	}
	/* for having space to touch to close drawer */
	.mobile-margin {
		margin-left: calc(100vw - 48px);
	}
</style>
