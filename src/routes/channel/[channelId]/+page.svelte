<script lang="ts">
	import DrawerChat from '$lib/components/Channel/Chat/DrawerChat.svelte'
	import StreamContainer from '$lib/components/Channel/Stream/StreamContainer.svelte'
	import type { PageData } from './$types'
	import { onDestroy, onMount } from 'svelte'
	import { get, del } from '$lib/api'
	import {
		emitHistoryToChannel,
		initChannelSocket,
		channelSocket,
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

	// export let data: PageData

	// $: ({ channelId } = data)

	let value: undefined
	let channelId = $page.params.channelId || ''

	let isDeleteModalOpen = false,
		showEditChannelDrawer = false,
		channels: any = [],
		channelLimit = 0,
		active_channel: any = null

	onMount(async () => {
		value = await get(`channel?channelId=${channelId}`)

		const channelSocketId = await get(`wsinit/channelid?channelId=${channelId}`)
		initChannelSocket(channelSocketId)

		channelSocket.addEventListener('open', (data) => {
			console.log('channel socket connection open')
			console.log(data)
			channel_connection.set('open')
			emitChannelSubscribeByUser({ channelId, userId: $page.data.user?.userId })
			emitHistoryToChannel({ channelId, skip: 100 })
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
		})

		setTimeout(() => {
			$is_chat_drawer_open = true
		}, 700)

		await loadMoreChannels()
	})

	onDestroy(() => channelSocket?.close())

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
		channelLimit += 10
		channels = await get(`channels?skip=${0}&limit=${channelLimit}`)
	}
</script>

{#if value}
	<div class="flex flex-auto">
		<div class="drawer drawer-end">
			<input
				id="chat-drawer"
				type="checkbox"
				class="drawer-toggle"
				bind:checked={$is_chat_drawer_open} />
			<div class="drawer-content">
				<StreamContainer
					channel={value}
					bind:active_channel
					bind:channels
					on:loadMore={loadMoreChannels} />

				{#if showEditChannelDrawer}
					<DrawerEditChannel channel={value} bind:showDrawer={showEditChannelDrawer} />
				{/if}
			</div>
			{#if !$is_chat_drawer_destroy}
				<div
					class="drawer-side m-5 rounded-lg md:w-fit lg:drop-shadow-lg"
					class:!hidden={showEditChannelDrawer}>
					<label for="chat-drawer" class="drawer-overlay" />

					<DrawerChat bind:active_channel channel={value} bind:showEditChannelDrawer />
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
