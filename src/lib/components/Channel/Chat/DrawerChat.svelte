<script lang="ts">
	import ChatInput from '$lib/components/Channel/Chat/ChatInput.svelte'
	import Message from '$lib/components/Channel/Chat/Message.svelte'
	import { channelMessage } from '$lib/stores/websocketStore'
	import { isJsonString } from '$lib/utils'
	import CollapseViewChannel from '$lib/components/Channel/Chat/CollapseViewChannel.svelte'

	export let showDrawer: boolean,
		channel: any = undefined,
		chatHistory: any = [],
		userId: string = '',
		username: string = ''

	channelMessage.subscribe((value) => {
		if (!value || !isJsonString(value)) return
		const parsedData = JSON.parse(value)
		if (parsedData.eventName === `channel-message-${channel._id}`) {
			var msg = parsedData
			if (msg.userData.userId === channel.user) msg.role = 'Host'
			else if (channel.mods?.includes(msg.userData._id)) msg.role = 'Mod'
			else if (msg.userData.userId === userId) msg.role = 'You'
			else msg.role = 'Rando'
			chatHistory.push(msg)
		}
	})
</script>

<div class="drawer drawer-end w-fit z-20 top-0 right-0">
	<input id="chat-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side justify-end m-5 rounded-lg">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="bg-base-100 flex flex-col ">
			<CollapseViewChannel bind:channel/>
			<div class="flex flex-col-reverse p-3 grow overflow-y-auto">
				{#each chatHistory as sender}
					<Message bind:sender />
				{/each}
			</div>
			<div class="flex flex-row mt-auto p-3 w-full">
				<ChatInput bind:channelId={channel._id} bind:userId bind:username />
			</div>
		</div>
	</div>
</div>
