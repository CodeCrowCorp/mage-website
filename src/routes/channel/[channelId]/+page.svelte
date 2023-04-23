<script lang="ts">
	import DrawerChat from '$lib/components/Channel/Chat/DrawerChat.svelte'
	import StreamContainer from '$lib/components/Channel/Stream/StreamContainer.svelte'
	import { onDestroy, onMount } from 'svelte'
	import { get, del } from '$lib/api'
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
	import { updateVideoItems, video_items } from '$lib/stores/streamStore'

	let channel: any
	let channelId = $page.params.channelId || ''
	$: userCount = 0

	let isDeleteModalOpen = false,
		showEditChannelDrawer = false,
		channels: any = [],
		skip = 0,
		limit = 10,
		host = {},
		isHost = false

	$: if (channel) {
		if (channel._id !== channelId) {
			channelId = channel?._id
			handleWebsocket()
		}
	}

	onMount(async () => {
		channelId = $page.params.channelId || ''
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
		await getHost(channel.user)
		channels.push(channel)
	}

	const getHost = async (userId: string) => {
		host = await get(`users/search/id?userId=${userId}`)
		isHost = userId === $page?.data?.user?.userId
	}

	const getLiveInputs = async (channelId: string) => {
		return await get(`cloudflare/live-input?channelId=${channelId}`)
	}

	const handleWebsocket = async () => {
		channelSocket?.close()
		const channelSocketId = await get(`wsinit/channelid?channelId=${channelId}`)
		initChannelSocket(channelSocketId)
		channelSocket.addEventListener('open', async (data) => {
			console.log('channel socket connection open', channelSocketId)
			$channel_connection = 'open'
			$channel_message = ''
			$video_items = []
			emitChannelSubscribeByUser({
				channelId,
				userId: $page.data.user?.userId,
				username: $page.data.user?.user?.username
			})
			emitChatHistoryToChannel({ channelId, skip: 100 })
			getHost(channel.user)
		})
		channelSocket.addEventListener('message', (data) => {
			console.log('channel listening to messages')
			if (isJsonString(data.data)) {
				console.log('data.data', data.data)
				$channel_message = data.data
			}
		})
		channelSocket.addEventListener('error', (data) => {
			console.log('channel socket connection error')
			console.log(data)
		})
		channelSocket.addEventListener('close', (data) => {
			console.log('channel socket connection close')
			console.log(data)
			$channel_connection = 'close'
			$channel_message = ''
			$video_items = []
		})
	}

	const deleteChannelNoAction = () => {
		isDeleteModalOpen = false
	}

	const deleteChannelYesAction = async () => {
		await del(`channels?channelId=${channelId}&bucketName=attachments`, {
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
			case `channel-update-${channelId}`:
				channel = parsedMsg.channels
				break
			case `channel-subscribe-${channelId}`:
				userCount = parsedMsg.userCount
				if (parsedMsg.quitUserId) {
					$video_items = $video_items.filter((video: any) => video._id !== parsedMsg.quitUserId)
				} else {
					const activeGuests = parsedMsg.activeGuests
					if (activeGuests?.length) {
						$video_items = [...activeGuests]
						const liveInputs = await getLiveInputs(channelId)
						$video_items = updateVideoItems($video_items, liveInputs)
					}
				}
				break
			case `channel-streaming-action-${channelId}`:
				switch (parsedMsg.data.action) {
					case 'toggleTrack-start':
						if ($page.data.user.userId !== parsedMsg.data.video._id) {
							$video_items = updateVideoItems($video_items, [parsedMsg.data.video])
						}
						break
					case 'toggleTrack-stop':
						if ($page.data.user.userId !== parsedMsg.data.video._id) {
							$video_items = updateVideoItems($video_items, [parsedMsg.data.video])
						}
						break
				}
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
				<StreamContainer bind:channel bind:userCount bind:channels on:loadMore={loadMoreChannels} />

				{#if showEditChannelDrawer}
					<DrawerEditChannel bind:channel bind:showDrawer={showEditChannelDrawer} />
				{/if}
			</div>
			{#if !$is_chat_drawer_destroy}
				<div
					class="drawer-side m-5 rounded-lg md:w-fit lg:drop-shadow-lg"
					class:!hidden={showEditChannelDrawer}>
					<label for="chat-drawer" class="drawer-overlay" />

					<DrawerChat bind:channel bind:showEditChannelDrawer bind:host bind:isHost />
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
