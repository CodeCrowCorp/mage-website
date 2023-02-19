<script lang="ts">
	import IconChatDrawer from '$lib/assets/icons/channel/IconChatDrawer.svelte'
	import DrawerChat from '$lib/components/Channel/Chat/DrawerChat.svelte'
	import type { PageData } from './$types'
	import { onDestroy, onMount } from 'svelte'
	import { get } from '$lib/api'
	import {
		emitHistoryToChannel,
		initChannelSocket,
		channelSocket,
		emitChannelSubscribeByUser
	} from '$lib/websocket'
	import { channelConnection, channelMessage } from '$lib/stores/websocketStore'
	import { isJsonString } from '$lib/utils'
	import VideoGrid from '$lib/components/Channel/VideoGrid.svelte'
	export let data: PageData

	$: chatHistory = []
	$: ({ post, userId, username } = data)
	let showDrawer = true

	onMount(async () => {
		const channelSocketId = await get(`wsinit/channelid?channelId=${post._id}`)
		initChannelSocket(channelSocketId)
		channelSocket.addEventListener('open', (data) => {
			console.log('channel socket connection open')
			console.log(data)
			channelConnection.set('open')
			emitChannelSubscribeByUser({ channelId: post._id, userId })
			emitHistoryToChannel({ channelId: post._id, skip: 100 })
		})
		channelSocket.addEventListener('message', (data) => {
			console.log('listening to messages')
			console.log(data.data)
			if (isJsonString(data.data)) channelMessage.set(data.data)
		})
		channelSocket.addEventListener('error', (data) => {
			console.log('socket connection error')
			console.log(data)
		})
		channelSocket.addEventListener('close', (data) => {
			console.log('socket connection close')
			console.log(data)
			channelConnection.set('close')
		})
	})

	onDestroy(() => channelSocket?.close())
</script>

<div class="flex flex-auto gap-4 justify-end">
	<div class="flex-auto">
		<VideoGrid />
	</div>
	<div class="form-control p-5">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label
			for="chat-drawer"
			class="btn gap-2 drawer-button"
			on:click={() => (showDrawer = !showDrawer)}>
			<IconChatDrawer /></label>
	</div>

	{#if showDrawer}
		<DrawerChat bind:showDrawer bind:channel={post} bind:chatHistory bind:userId bind:username />
	{/if}
</div>
