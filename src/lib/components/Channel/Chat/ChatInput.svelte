<script lang="ts">
	// import IconChatAttachment from '$lib/assets/icons/chat/IconChatAttachment.svelte'
	// import IconChatEmoji from '$lib/assets/icons/chat/IconChatEmoji.svelte'
	// import IconChatGif from '$lib/assets/icons/chat/IconChatGif.svelte'
	// import IconChatCode from '$lib/assets/icons/chat/IconChatCode.svelte'
	import IconChatSendMessage from '$lib/assets/icons/chat/IconChatSendMessage.svelte'
	import { emitMessageToChannel } from '$lib/websocket'

	export let channelId: string, userId: string, username: string

	$: chatMessage = ''

	const sendMessage = () => {
		if (chatMessage === '') return
		const completeMessage = {
			body: chatMessage,
			state: { timestamp: new Date().toISOString() },
			user: { userId: userId || '', username: username || '' }
		}
		emitMessageToChannel({ channelId, message: JSON.stringify(completeMessage) })
		chatMessage = ''
	}
</script>

<form class="rounded-lg bg-base-200 p-2 w-96">
	<!-- <button
		type="button"
		class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
		<IconChatAttachment />
		<span class="sr-only">Upload attachment</span>
	</button>
	<button
		type="button"
		class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
		<IconChatEmoji />
		<span class="sr-only">Add emoji</span>
	</button>
	<button
		type="button"
		class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
		<IconChatGif />
		<span class="sr-only">Add GIF</span>
	</button>
	<button
		type="button"
		class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
		<IconChatCode />
		<span class="sr-only">Add code snippet</span>
	</button> -->
	<div class="flex items-center py-2 rounded-lg">
		<textarea
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					sendMessage()
					e.preventDefault()
				}
			}}
			bind:value={chatMessage}
			rows="1"
			class="block mx-2 p-2.5 w-full text-sm textarea textarea-bordered textarea-secondary"
			placeholder="Your message..." /><!--focus:h-32 -->
		<button
			on:click={() => sendMessage()}
			class="inline-flex justify-center p-2 text-secondary rounded-full cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
			<IconChatSendMessage />
			<span class="sr-only">Send message</span>
		</button>
	</div>
</form>
