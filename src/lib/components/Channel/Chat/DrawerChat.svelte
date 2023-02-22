<script lang="ts">
	import ChatInput from '$lib/components/Channel/Chat/ChatInput.svelte'
	import Message from '$lib/components/Channel/Chat/Message.svelte'
	import { channelMessage, chatHistory } from '$lib/stores/websocketStore'
	import { isJsonString } from '$lib/utils'
	import CollapseViewChannel from '$lib/components/Channel/Chat/CollapseViewChannel.svelte'
	import VideoGrid from '$lib/components/Channel/VideoGrid.svelte'

	export let channel: any = undefined,
		userId: string = '',
		username: string = ''

	$: channelMessage.subscribe((value) => {
		if (!value || !isJsonString(value)) return
		var parsedMsg = JSON.parse(value)
		if (parsedMsg.eventName === `channel-message-${channel._id}`) {
			if (parsedMsg.isMessageHistory) {
				parsedMsg.data.forEach((message: any) => {
					const updatedMsgWithRole = setRole(message)
					$chatHistory.push(updatedMsgWithRole)
				})
			} else {
				parsedMsg = setRole(parsedMsg)
				$chatHistory.push(parsedMsg)
			}
			console.log('chatHistory', chatHistory)
		}
	})

	function setRole(msg: any): any {
		if (msg.userData?.userId === channel.user) msg.role = 'Host'
		else if (channel.mods?.includes(msg.userData._id)) msg.role = 'Mod'
		else if (msg.userData?.userId === userId) msg.role = 'You'
		else msg.role = 'Rando'
		return msg
	}
</script>

<div class="drawer drawer-end">
	<input id="chat-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<VideoGrid />
	</div>
	<div class="drawer-side m-5 rounded-lg md:w-fit">
		<label for="chat-drawer" class="drawer-overlay" />

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="bg-base-100 flex flex-col overflow-y-hidden">
			<CollapseViewChannel bind:channel />
			<div class="flex flex-col-reverse p-3 grow overflow-y-auto">
				{#each $chatHistory as sender}
					<Message bind:sender />
				{/each}
			</div>
			<div class="flex flex-row mt-auto p-3 w-full">
				<ChatInput bind:channelId={channel._id} bind:userId bind:username />
			</div>
		</div>
	</div>
</div>
