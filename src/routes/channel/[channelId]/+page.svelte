<script lang="ts">
	import IconChatDrawer from '$lib/assets/icons/channel/IconChatDrawer.svelte'
	import ChatDrawer from '$lib/components/Channel/Chat/ChatDrawer.svelte'
	import type { PageData } from './$types'
	import { onDestroy, onMount } from 'svelte'
	import { get } from '$lib/api'
	import { channelSocket, initChannelSocket } from '$lib/websocket'
	import { channelConnection, channelMessage } from '$lib/stores/websocketStore'

	export let data: PageData

	$: chatHistory = []
	$: ({ post, userId } = data)
	let showDrawer = true

	onMount(async () => {
		const channelSocketId = await get(`wsinit/channelid?channelId=${post._id}`)
		initChannelSocket(channelSocketId)
		channelSocket?.addEventListener('open', (data) => {
			console.log('channel socket connection open')
			console.log(data)
			channelConnection.set('open')
		})
		channelSocket?.addEventListener('message', (data) => {
			console.log('listening to messages')
			console.log(data)
			channelMessage.set(data)
		})
		channelSocket?.addEventListener('error', (data) => {
			console.log('socket connection error')
			console.log(data)
		})
		channelSocket?.addEventListener('close', (data) => {
			console.log('socket connection close')
			console.log(data)
			channelConnection.set('close')
		})
	})

	onDestroy(() => channelSocket?.close())
</script>

<div class="flex flex-col md:flex-row gap-4 justify-end">
	<div class="form-control p-5">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label
			for="chat-drawer"
			class="btn gap-2 drawer-button"
			on:click={() => (showDrawer = !showDrawer)}>
			<IconChatDrawer /></label>
	</div>

	{#if showDrawer}
		<ChatDrawer bind:showDrawer bind:channel={post} bind:chatHistory bind:userId />
	{/if}
</div>
