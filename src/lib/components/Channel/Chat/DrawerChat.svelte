<script lang="ts">
	import ChatInput from '$lib/components/Channel/Chat/ChatInput.svelte'
	import Message from '$lib/components/Channel/Chat/Message.svelte'
	import { channel_connection, channel_message } from '$lib/stores/websocketStore'
	import DropdownViewChannel from '$lib/components/Channel/Chat/DropdownViewChannel.svelte'
	import { page } from '$app/stores'
	import { onDestroy, onMount } from 'svelte'
	import { is_chat_drawer_open, was_chat_drawer_closed } from '$lib/stores/channelStore'
	import { emitChatHistoryToChannel } from '$lib/websocket'
	import { setRole } from '$lib/utils'

	export let channel: any = undefined,
		showEditChannelDrawer: boolean = false
	let chatHistory: any[] = [],
		chatDrawerElement: HTMLElement

	channel_message.subscribe((value) => {
		if (!value) return
		var parsedMsg = JSON.parse(value)
		if (parsedMsg.eventName === `channel-message-${channel?._id}`) {
			if (parsedMsg.isMessageHistory) {
				chatHistory = []
				// if (Array.isArray(parsedMsg.data)) {
				parsedMsg.data.forEach((message: any) => {
					message.role = setRole({
						userId: message.user.userId,
						channel,
						currentUserId: $page.data.user?.userId
					})
					chatHistory.push(message)
				})
				// } else {
				// 	parsedMsg = setRole(JSON.parse(parsedMsg.data))
				// 	chatHistory.push(parsedMsg)
				// }
			} else if (parsedMsg.isMessageDeleted) {
				chatHistory = chatHistory.filter((item) => item.timestamp !== parsedMsg.data.timestamp)
			} else {
				parsedMsg.role = setRole({
					userId: parsedMsg.user.userId,
					channel,
					currentUserId: $page.data.user?.userId
				})
				chatHistory.unshift(parsedMsg)
			}
			chatHistory = chatHistory
		}
	})

	onMount(() => {
		if (
			$was_chat_drawer_closed &&
			!chatHistory?.length &&
			$channel_connection === `open-${channel._id}` &&
			channel.socket?.readyState === WebSocket.OPEN
		) {
			emitChatHistoryToChannel({ channelSocket: channel.socket, channelId: channel._id, skip: 100 })
			chatDrawerElement = document.getElementById(`chat_drawer`) as HTMLElement
		}
	})

	onDestroy(() => {
		$is_chat_drawer_open = false
	})

	const createuserList = (list: any[]) => {
		let users: any = {}
		list.forEach((chat) => {
			if ($page.data.user?.userId !== chat.user.userId) users[chat.user.userId] = chat.user
		})
		return Object.keys(users).map((key) => users[key])
	}

	const handleOnScroll = (event) => {
		if (chatDrawerElement.scrollTop === 0) {
			console.log('got here----sheheh')
			if (
				$channel_connection === `open-${channel._id}` &&
				channel.socket?.readyState === WebSocket.OPEN
			) {
				emitChatHistoryToChannel()
			}
		}
	}

	$: users = createuserList(chatHistory)
</script>

<div class="bg-base-100 flex flex-col overflow-y-hidden w-72 md:w-full h-full rounded-lg">
	<DropdownViewChannel bind:channel bind:showEditChannelDrawer />
	<div
		class="flex flex-col-reverse p-3 grow overflow-y-scroll w-96"
		on:scroll={handleOnScroll}
		id="chat_drawer">
		{#each chatHistory as sender}
			<Message bind:sender bind:hostId={channel.user} bind:channel />
		{/each}
	</div>
	<div class="flex flex-row mt-auto p-3 w-full">
		<ChatInput bind:channel bind:users />
	</div>
</div>
