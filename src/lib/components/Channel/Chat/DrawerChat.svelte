<script lang="ts">
	import ChatInput from '$lib/components/Channel/Chat/ChatInput.svelte'
	import Message from '$lib/components/Channel/Chat/Message.svelte'
	import { channel_message } from '$lib/stores/websocketStore'
	import DropdownViewChannel from '$lib/components/Channel/Chat/DropdownViewChannel.svelte'
	import { page } from '$app/stores'
	import { onDestroy } from 'svelte'
	import { is_chat_drawer_open } from '$lib/stores/channelStore'

	export let channel: any = undefined,
		showEditChannelDrawer: boolean = false,
		active_channel: any = undefined
	let chatHistory: any[] = []

	// $: if (active_channel) {
	// 	channel = active_channel
	// 	chatHistory = []
	// }

	const setRole = (msg: any): any => {
		if (msg.userData?.userId === channel?.user) msg.role = 'Host'
		else if (channel?.mods?.includes(msg.userData._id)) msg.role = 'Mod'
		else if (msg.userData?.userId === $page.data.user?.userId) msg.role = 'You'
		else msg.role = 'Rando'
		return msg
	}

	channel_message.subscribe((value) => {
		if (!value) return
		var parsedMsg = JSON.parse(value)
		if (parsedMsg.eventName === `channel-message-${channel?._id}`) {
			if (parsedMsg.isMessageHistory) {
				if (Array.isArray(parsedMsg.data)) {
					parsedMsg.data.forEach((message: any) => {
						const updatedMsgWithRole = setRole(message)
						chatHistory.push(updatedMsgWithRole)
					})
				} else {
					parsedMsg = setRole(JSON.parse(parsedMsg.data))
					chatHistory.push(parsedMsg)
				}
			} else if (parsedMsg.isMessageDeleted) {
				chatHistory = chatHistory.filter((item) => item.timestamp !== parsedMsg.data.timestamp)
			} else {
				parsedMsg = setRole(parsedMsg)
				chatHistory.push(parsedMsg)
			}
			chatHistory = chatHistory.reverse()
		}

		if (parsedMsg.eventName === `channel-update-${channel._id}`) {
			channel = parsedMsg.channel
		}
	})

	onDestroy(() => {
		$is_chat_drawer_open = false
	})
</script>

<div class="bg-base-100 flex flex-col overflow-y-hidden w-72 md:w-full">
	<DropdownViewChannel bind:channel bind:showEditChannelDrawer />
	<div class="flex flex-col-reverse p-3 grow overflow-y-scroll w-96">
		{#each chatHistory as sender}
			<Message bind:sender bind:hostId={channel.user} bind:channel />
		{/each}
	</div>
	<div class="flex flex-row mt-auto p-3 w-full">
		<ChatInput bind:channelId={channel._id} />
	</div>
</div>
