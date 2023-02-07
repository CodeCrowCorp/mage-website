<script lang="ts">
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import ChatDrawer from '$lib/components/Chat/ChatDrawer.svelte'
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { get } from '$lib/api'
	import { env } from '$env/dynamic/public'
	import { channelConnection, channelMessage } from '$lib/stores/socketStore'

	export let data: PageData

	$: ({ post } = data)
	let showDrawer = false

	onMount(async () => {
		const channelSocketId = await get(`wsinit/channelid?channelId=${data.post._id}`)		
		const channelSocket = new WebSocket(
			`${env.PUBLIC_WEBSOCKET_URL}/wsinit/channelid/${channelSocketId}/connect`
		)
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
</script>

<div class="flex flex-col md:flex-row gap-4 py-5 pl-5">
	<div class="form-control">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label
			for="create-channel-drawer"
			class="btn w-[21rem] btn-primary gap-2 drawer-button"
			on:click={() => (showDrawer = true)}>
			<IconCreate />
			Show Chat</label>
	</div>

	{#if showDrawer}
		<ChatDrawer bind:showDrawer bind:channel={post} />
	{/if}
</div>
