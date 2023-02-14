<script lang="ts">
	import ChatInput from '$lib/components/Channel/Chat/ChatInput.svelte'
	import ChatMessage from '$lib/components/Channel/Chat/ChatMessage.svelte'
	import { channelMessage } from '$lib/stores/websocketStore'

	export let showDrawer: boolean,
		channel: any = undefined,
		chatHistory: any = [],
		userId: string = ''

	$: chatHistory = chatHistory

	channelMessage.subscribe((value) => {
		if (!value) return
		try {
			const parsedData = JSON.parse(value.data)
			console.log('parsedData', parsedData)
			if (parsedData.eventName === `channel-message-${channel._id}`) {
				var msg = parsedData.data
				if (msg.user._id === channel.user) msg.role = 'Host'
				else if (channel.mods?.includes(msg.user._id)) msg.role = 'Mod'
				else if (msg.user._id === userId) msg.role = 'You'
				else msg.role = 'Rando'
				chatHistory.push(parsedData.data)
			}
		} catch (err) {
			console.log(err)
		}
	})
</script>

<div class="drawer drawer-end w-fit z-20 top-0 right-0">
	<input id="chat-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side justify-end">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="bg-base-100 flex flex-col ">
			<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
				{channel.title || 'Chat'}
			</p>
			<div class="flex flex-col-reverse p-3 grow h-80 overflow-y-auto">
				{#each chatHistory as sender}
					<ChatMessage bind:sender />
				{/each}
			</div>
			<div class="flex flex-row mt-auto p-3 w-full">
				<ChatInput />
			</div>
		</div>
	</div>
</div>
