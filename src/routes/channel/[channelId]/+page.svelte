<script lang="ts">
	import DrawerChat from '$lib/components/Channel/Chat/DrawerChat.svelte'
	import StreamContainer from '$lib/components/Channel/Stream/StreamContainer.svelte'
	import { onDestroy, onMount } from 'svelte'
	import { get, del } from '$lib/api'
	import {
		emitChatHistoryToChannel,
		initChannelSocket,
		emitChannelSubscribeByUser,
		emitDeleteAllMessagesToChannel
	} from '$lib/websocket'
	import { channel_connection, channel_message } from '$lib/stores/websocketStore'
	import { isJsonString } from '$lib/utils'
	import { is_chat_drawer_open, is_chat_drawer_destroy } from '$lib/stores/channelStore'
	import Modal from '$lib/components/Global/Modal.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import DrawerEditChannel from '$lib/components/Channel/Chat/DrawerEditChannel.svelte'
	import {
		is_sharing_screen,
		is_sharing_webcam,
		is_sharing_audio,
		updateVideoItems
	} from '$lib/stores/streamStore'

	let channel: any,
		isDeleteModalOpen = false,
		showEditChannelDrawer = false,
		channels: any = [],
		skip = 0,
		limit = 10,
		viewers: any[] = [],
		chatHistory: any[] = []

	$: userCount = 0
	$: isHostOrGuest =
		channel?.user === $page.data.user?.userId || channel?.guests?.includes($page.data.user?.userId)

	$: if (channel) {
		if (channel._id !== $page.params.channelId) {
			if (isHostOrGuest) {
				if ($is_sharing_screen) $is_sharing_screen = false
				if ($is_sharing_webcam) $is_sharing_webcam = false
				if ($is_sharing_audio) $is_sharing_audio = false
			} else {
				$is_sharing_screen = undefined
				$is_sharing_webcam = undefined
				$is_sharing_audio = undefined
			}
			handleWebsocket()
			timeoutConnection()
		}
	}

	onMount(async () => {
		await loadChannel()
		await handleWebsocket()
		await loadMoreChannels()
		$is_chat_drawer_destroy = false
		setTimeout(() => {
			$is_chat_drawer_open = true
		}, 600)
	})

	onDestroy(() => {
		if (isHostOrGuest) {
			if ($is_sharing_screen) $is_sharing_screen = false
			if ($is_sharing_webcam) $is_sharing_webcam = false
			if ($is_sharing_audio) $is_sharing_audio = false
		} else {
			$is_sharing_screen = undefined
			$is_sharing_webcam = undefined
			$is_sharing_audio = undefined
		}
		channels.forEach((ch: any) => {
			if (ch.socket && ch.socket.constructor === WebSocket) ch.socket.close()
		})
	})

	const loadChannel = async () => {
		const chan = await get(`channel?channelId=${$page.params.channelId}`)
		chan.videoItems = []
		channels.push(chan)
	}

	const initChannel = (chan: any) => {
		$channel_connection = `open-${$page.params.channelId}`
		$channel_message = ''
		chan.videoItems = []
		if (chan.socket.readyState === WebSocket.OPEN) {
			emitChannelSubscribeByUser({
				channelSocket: chan.socket,
				channelId: $page.params.channelId,
				userId: $page.data.user?.userId,
				username: $page.data.user?.user?.username
			})
			emitChatHistoryToChannel({
				channelSocket: chan.socket,
				channelId: $page.params.channelId,
				skip: 100
			})
		}
	}

	const handleWebsocket = async () => {
		try {
			channel = channels.find((ch: any) => ch._id === $page.params.channelId)
			chatHistory = []
			isHostOrGuest =
				channel.user === $page.data.user?.userId ||
				channel.guests?.includes($page.data.user?.userId)
			let channelSocketId = ''
			if (!channel.socket) {
				channelSocketId = await get(`wsinit/channelid?channelId=${$page.params.channelId}`)
				channel.socket = initChannelSocket({ websocketId: channelSocketId })
			} else {
				initChannel(channel)
			}
			if (channel.socket && channel.socket.constructor === WebSocket) {
				channel.socket.addEventListener('open', async (data: any) => {
					console.log('channel socket connection open', channelSocketId)
					initChannel(channel)
				})
				channel.socket.addEventListener('message', (data: any) => {
					console.log('channel listening to messages')
					if (isJsonString(data.data)) {
						console.log('data.data', data.data)
						$channel_message = data.data
					}
				})
				channel.socket.addEventListener('error', (data: any) => {
					console.log('channel socket connection error')
					console.log(data)
				})
				channel.socket.addEventListener('close', (data: any) => {
					console.log('channel socket connection close')
					console.log(data)

					//if manually closed, don't reconnect
					if (data.code === 1005) return
					attemptReconnect()
				})
			}
		} catch (error) {
			console.log(error)
			if (error) attemptReconnect()
		}
	}

	const attemptReconnect = () => {
		setTimeout(async () => {
			console.log('Reconnecting to WebSocket...')
			const chan = channels.find((ch: any) => ch._id === $page.params.channelId)
			delete chan.socket
			await handleWebsocket()
		}, 4000)
	}

	const timeoutConnection = () => {
		const currentChannelIndex = channels.findIndex((ch: any) => ch._id === $page.params.channelId)
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
		await del(`channels?channelId=${$page.params.channelId}&bucketName=attachments`, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		emitDeleteAllMessagesToChannel({
			channelSocket: channel.socket,
			channelId: $page.params.channelId
		})
		goto('/browse')
	}

	const loadMoreChannels = async () => {
		let newchannels = await get(`channels?skip=${skip}&limit=${limit}`)
		//Remove duplicate channels
		newchannels = newchannels.filter(
			(newChannel: any) => !channels.some((channel: any) => channel._id === newChannel._id)
		)
		newchannels.forEach((channel: any) => {
			channel.videoItems = []
		})
		channels = [...channels, ...newchannels]
		skip += limit
	}

	channel_message.subscribe(async (value: any) => {
		if (!value || (channel && $page.params.channelId !== channel._id)) return
		var parsedMsg = JSON.parse(value)
		switch (parsedMsg.eventName) {
			case `channel-update-${$page.params.channelId}`:
				console.log('channel-update', parsedMsg)
				channel = { ...parsedMsg.channel, socket: channel.socket, videoItems: channel.videoItems }

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
			case `channel-subscribe-${$page.params.channelId}`:
				userCount = parsedMsg.userCount
				if (parsedMsg.quitUserId) {
					channel.videoItems = channel.videoItems.filter(
						(video: any) => video._id !== parsedMsg.quitUserId
					)
				} else {
					const activeGuests = parsedMsg.activeGuests
					if (activeGuests?.length) {
						if (channel.videoItems.length) {
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
							const liveInputs = await get(
								`cloudflare/live-inputs?channelId=${$page.params.channelId}`
							)
							channel.videoItems = updateVideoItems([...activeGuests], liveInputs)
						}
					}
				}
				break
			case `channel-streaming-action-${$page.params.channelId}`:
				switch (parsedMsg.data.action) {
					case 'toggleTrack':
						if ($page.data.user?.userId) {
							if ($page.data.user.userId !== parsedMsg.data.video._id) {
								channel.videoItems = updateVideoItems(channel.videoItems, [parsedMsg.data.video])
							}
						} else {
							channel.videoItems = updateVideoItems(channel.videoItems, [parsedMsg.data.video])
						}
						break
				}
				break
		}
	})
</script>

{#if channel && channel._id === $page.params.channelId}
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
				bind:viewers />

			{#if showEditChannelDrawer}
				<DrawerEditChannel bind:channel bind:showDrawer={showEditChannelDrawer} />
			{/if}
		</div>
		{#if !$is_chat_drawer_destroy}
			<div class={'absolute right-0 top-0 ' + ($is_chat_drawer_open ? 'drawer-container' : 'w-0')}>
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
{/if}

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
