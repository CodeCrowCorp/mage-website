<script lang="ts">
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
	export let data: PageData

	$: ({ post, userId, username } = data)

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
	})

	onDestroy(() => channelSocket?.close())
</script>

<div class="flex flex-auto">
	<DrawerChat bind:channel={post} bind:userId bind:username />
</div>
