<script lang="ts">
	import ChatInput from '$lib/components/Channel/Chat/ChatInput.svelte'
	import Message from '$lib/components/Channel/Chat/Message.svelte'
	import { channelMessage } from '$lib/stores/websocketStore'
	import CollapseViewChannel from '$lib/components/Channel/Chat/CollapseViewChannel.svelte'

	export let channel: any = undefined,
		userId: string = '',
		username: string = ''

	let chatHistory: any[] = []

	const setRole = (msg: any): any => {
		if (msg.userData?.userId === channel?.user) msg.role = 'Host'
		else if (channel?.mods?.includes(msg.userData._id)) msg.role = 'Mod'
		else if (msg.userData?.userId === userId) msg.role = 'You'
		else msg.role = 'Rando'
		return msg
	}

	channelMessage.subscribe((value) => {
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
	})
</script>

<div class="bg-base-100 flex flex-col overflow-y-hidden opacity-70">
	<CollapseViewChannel bind:channel />
	<div class="flex flex-col-reverse p-3 grow overflow-y-auto">
		{#each chatHistory as sender}
			<Message bind:sender />
		{/each}
	</div>
	<div class="flex flex-row mt-auto p-3 w-full">
		<ChatInput bind:channelId={channel._id} bind:userId bind:username />
	</div>
</div>
