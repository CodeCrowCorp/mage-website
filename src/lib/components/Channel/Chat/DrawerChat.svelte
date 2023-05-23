<script lang="ts">
	import ChatInput from '$lib/components/Channel/Chat/ChatInput.svelte'
	import Message from '$lib/components/Channel/Chat/Message.svelte'
	import { channel_connection, channel_message } from '$lib/stores/websocketStore'
	import DropdownViewChannel from '$lib/components/Channel/Chat/DropdownViewChannel.svelte'
	import { page } from '$app/stores'
	import { onDestroy, onMount } from 'svelte'
	import { is_chat_drawer_open, was_chat_drawer_closed } from '$lib/stores/channelStore'
	import { emitChatHistoryToChannel } from '$lib/websocket'

	export let channel: any = undefined,
		showEditChannelDrawer: boolean = false,
		host = {},
		isHost = false
	let chatHistory: any[] = []

	const setRole = (msg: any): any => {
		if (msg.user?.userId === 'AI') msg.role = '🤖 AI'
		else if (msg.user?.userId === channel?.user) msg.role = 'Host'
		else if (channel?.mods?.includes(msg.user._id)) msg.role = 'Mod'
		else if (msg.user?.userId === $page.data.user?.userId) msg.role = 'You'
		else msg.role = 'Rando'
		return msg
	}

	channel_message.subscribe((value) => {
		if (!value) return
		var parsedMsg = JSON.parse(value)
		if (parsedMsg.eventName === `channel-message-${channel?._id}`) {
			if (parsedMsg.isMessageHistory) {
				chatHistory = []
				// if (Array.isArray(parsedMsg.data)) {
				parsedMsg.data.forEach((message: any) => {
					const updatedMsgWithRole = setRole(message)
					chatHistory.push(updatedMsgWithRole)
				})
				// } else {
				// 	parsedMsg = setRole(JSON.parse(parsedMsg.data))
				// 	chatHistory.push(parsedMsg)
				// }
			} else if (parsedMsg.isMessageDeleted) {
				chatHistory = chatHistory.filter((item) => item.timestamp !== parsedMsg.data.timestamp)
			} else {
				parsedMsg = setRole(parsedMsg)
				chatHistory.unshift(parsedMsg)
			}
			chatHistory = chatHistory
		}
	})

	onMount(() => {
		if ($was_chat_drawer_closed && !chatHistory?.length && $channel_connection === 'open') {
			emitChatHistoryToChannel({ channelId: channel._id, skip: 100 })
		}
	})

	onDestroy(() => {
		$is_chat_drawer_open = false
	})
</script>

<div class="bg-base-100 flex flex-col overflow-y-hidden w-72 md:w-full">
	<DropdownViewChannel bind:channel bind:showEditChannelDrawer bind:host bind:isHost />
	<div class="flex flex-col-reverse p-3 grow overflow-y-scroll w-96">
		{#each chatHistory as sender}
			<Message bind:sender bind:hostId={channel.user} bind:channel />
		{/each}
	</div>
	<div class="flex flex-row mt-auto p-3 w-full">
		<ChatInput bind:channel />
	</div>
</div>
