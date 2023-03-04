<script lang="ts">
	import DrawerChat from '$lib/components/Channel/Chat/DrawerChat.svelte'
	import VideoGrid from '$lib/components/Channel/VideoGrid.svelte'
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
	export let data: PageData

	$: ({ channelId, userId, username } = data)
	let isChatDrawerOpen: boolean = false

	onMount(async () => {
		const channelSocketId = await get(`wsinit/channelid?channelId=${channelId}`)
		initChannelSocket(channelSocketId)
		channelSocket.addEventListener('open', (data) => {
			console.log('channel socket connection open')
			console.log(data)
			channelConnection.set('open')
			emitChannelSubscribeByUser({ channelId, userId })
			emitHistoryToChannel({ channelId, skip: 100 })
		})
		channelSocket.addEventListener('message', (data) => {
			console.log('channel listening to messages')
			if (isJsonString(data.data)) {
				console.log('data', data.data)
				channelMessage.set(data.data)
			}
		})
		channelSocket.addEventListener('error', (data) => {
			console.log('channel socket connection error')
			console.log(data)
		})
		channelSocket.addEventListener('close', (data) => {
			console.log('channel socket connection close')
			console.log(data)
			channelConnection.set('close')
		})

		setTimeout(() => {
			isChatDrawerOpen = true
		}, 700)
	})

	onDestroy(() => channelSocket?.close())
</script>

{#await data.lazy.channel}
	Loading...
{:then value}
	<div class="flex flex-auto">
		<div class="drawer drawer-end">
			<input
				id="chat-drawer"
				type="checkbox"
				class="drawer-toggle"
				bind:checked={isChatDrawerOpen} />
			<div class="drawer-content">
				<VideoGrid />
			</div>
			<div class="drawer-side m-5 rounded-lg md:w-fit">
				<label for="chat-drawer" class="drawer-overlay" />
				<DrawerChat channel={value} bind:userId bind:username />
			</div>
		</div>
	</div>
{/await}
