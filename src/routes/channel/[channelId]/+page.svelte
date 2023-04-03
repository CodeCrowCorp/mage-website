<script lang="ts">
	import DrawerChat from '$lib/components/Channel/Chat/DrawerChat.svelte'
	import StreamContainer from '$lib/components/Channel/Stream/StreamContainer.svelte'
	import { onDestroy, onMount } from 'svelte'
	import { get, del, post } from '$lib/api'
	import {
		emitChatHistoryToChannel,
		initChannelSocket,
		channelSocket,
		emitChannelSubscribeByUser,
		emitDeleteAllMessagesToChannel,
		emitChannelUpdate
	} from '$lib/websocket'
	import { channel_connection, channel_message } from '$lib/stores/websocketStore'
	import { isJsonString } from '$lib/utils'
	import { is_chat_drawer_open, is_chat_drawer_destroy } from '$lib/stores/channelStore'
	import Modal from '$lib/components/Global/Modal.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import DrawerEditChannel from '$lib/components/Channel/Chat/DrawerEditChannel.svelte'
	import { video_items } from '$lib/stores/streamStore'

	let channel: any
	let channelId = $page.params.channelId || ''

	let isDeleteModalOpen = false,
		showEditChannelDrawer = false,
		channels: any = [],
		skip = 0,
		limit = 10,
		active_channel: any = null

	$: if (active_channel) {
		channelId = active_channel?._id
		// First close connection here
		// channel_connection.set('close')

		handleWebsocket()
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

	onDestroy(() => channelSocket?.close())

	const loadChannel = async () => {
		channel = await get(`channel?channelId=${channelId}`)
	}

	const getLiveInputs = async (channelId: string) => {
		return await get(`cloudflare/live-input?channelId=${channelId}`)
	}

	const handleWebsocket = async () => {
		const channelSocketId = await get(`wsinit/channelid?channelId=${channelId}`)
		initChannelSocket(channelSocketId)

		channelSocket.addEventListener('open', async (data) => {
			console.log('channel socket connection open')
			console.log(data)
			channel_connection.set('open')
			emitChannelSubscribeByUser({ channelId, userId: $page.data.user?.userId })
			emitChatHistoryToChannel({ channelId, skip: 100 })
			$video_items = await getLiveInputs(channelId)
		})
		channelSocket.addEventListener('message', (data) => {
			console.log('channel listening to messages')
			if (isJsonString(data.data)) {
				console.log('data', data.data)
				channel_message.set(data.data)
			}
		})
		channelSocket.addEventListener('error', (data) => {
			console.log('channel socket connection error')
			console.log(data)
		})
		channelSocket.addEventListener('close', (data) => {
			console.log('channel socket connection close')
			console.log(data)
			channel_connection.set('close')
			channel_message.set(null)
		})
	}

	const deleteChannelNoAction = () => {
		isDeleteModalOpen = false
	}

	const deleteChannelYesAction = async () => {
		await del(`channels?channelId=${channelId}`, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		emitDeleteAllMessagesToChannel({ channelId })
		goto('/browse')
	}

	const loadMoreChannels = async () => {
		let newchannels = await get(`channels?skip=${skip}&limit=${limit}`)
		channels = [...channels, ...newchannels]
		skip += limit
	}

	channel_message.subscribe(async (value: any) => {
		if (!value) return
		var parsedMsg = JSON.parse(value)
		switch (parsedMsg.eventName) {
			case `channel-subscribe-${channelId}`:
				//TODO: send back userIds from server
				let videoItems = []
				const connectedUserIds = parsedMsg.data.userIds
				if (connectedUserIds?.length) {
					const activeUserIds = connectedUserIds.filter((userId: string) =>
						channel?.guests.includes(userId)
					)
					const users = await post(`users/search/ids`, activeUserIds)
					const updatedUsers = users.map(
						({ _id, username, avatar }: { _id: string; username: string; avatar: string }) => ({
							_id,
							username,
							avatar
						})
					)
					videoItems.push(...updatedUsers)
				}
				break
			case `channel-streaming-action-${channelId}`:
				switch (parsedMsg.data.action) {
					case 'toggleTrack-start':
						if (
							!$video_items.some((video: any) => video.trackName === parsedMsg.data.video.trackName)
						) {
							$video_items.push(parsedMsg.data.video)
						}
						break
					case 'toggleTrack-stop':
						$video_items = $video_items.filter(
							(video: any) => video.trackName !== parsedMsg.data.video.trackName
						)
						break
				}
				break
			case `channel-streaming-video-history-${$page.data.user?.userId}`:
				$video_items = parsedMsg.data.videos
				break
		}
	})
</script>

{#if channel}
	<div class="flex flex-auto">
		<div class="drawer drawer-end">
			<input
				id="chat-drawer"
				type="checkbox"
				class="drawer-toggle"
				bind:checked={$is_chat_drawer_open} />
			<div class="drawer-content">
				<StreamContainer
					{channel}
					bind:active_channel
					bind:channels
					on:loadMore={loadMoreChannels} />

				{#if showEditChannelDrawer}
					<DrawerEditChannel {channel} bind:showDrawer={showEditChannelDrawer} />
				{/if}
			</div>
			{#if !$is_chat_drawer_destroy}
				<div
					class="drawer-side m-5 rounded-lg md:w-fit lg:drop-shadow-lg"
					class:!hidden={showEditChannelDrawer}>
					<label for="chat-drawer" class="drawer-overlay" />

					<DrawerChat bind:active_channel {channel} bind:showEditChannelDrawer />
				</div>
			{/if}
		</div>
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
