<script lang="ts">
	import IconChatAttachment from '$lib/assets/icons/chat/IconChatAttachment.svelte'
	import IconChatEmoji from '$lib/assets/icons/chat/IconChatEmoji.svelte'
	import IconChatGif from '$lib/assets/icons/chat/IconChatGif.svelte'
	import IconChatCode from '$lib/assets/icons/chat/IconChatCode.svelte'
	import IconChatSendMessage from '$lib/assets/icons/chat/IconChatSendMessage.svelte'
	import { emitMessageToChannel } from '$lib/websocket'
	import { page } from '$app/stores'
	import { channel_connection } from '$lib/stores/websocketStore'

	export let channel: any

	$: chatMessage = ''

	$: isChannelSocketConnected =
		$channel_connection === 'open' && $page.data?.user?.userId ? true : false

	const sendMessage = () => {
		if (chatMessage === null || chatMessage.match(/^\s*$/) !== null) return
		const completeMessage = {
			body: chatMessage,
			state: { timestamp: new Date().toISOString() },
			user: {
				userId: $page.data.user?.userId || '',
				username: $page.data.user?.user?.username || ''
			}
		}
		emitMessageToChannel({ channelId: channel._id, message: JSON.stringify(completeMessage) })
		chatMessage = ''
	}
</script>

<form class="rounded-lg bg-base-200 p-2 w-full">
	<button
		disabled
		type="button"
		class="btn border-none text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 tooltip font-normal normal-case"
		data-tip="Attachment">
		<IconChatAttachment />
		<span class="sr-only">Upload attachment</span>
	</button>
	<button
		disabled
		type="button"
		class="btn border-none text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 tooltip font-normal normal-case"
		data-tip="Emoji">
		<IconChatEmoji />
		<span class="sr-only">Add emoji</span>
	</button>
	<button
		disabled
		type="button"
		class="btn border-none text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 tooltip font-normal normal-case"
		data-tip="GIF">
		<IconChatGif />
		<span class="sr-only">Add GIF</span>
	</button>
	<button
		disabled
		type="button"
		class="btn border-none text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 tooltip font-normal normal-case"
		data-tip="Code snippet">
		<IconChatCode />
		<span class="sr-only">Add code snippet</span>
	</button>
	<div class="flex items-center py-2 rounded-lg">
		{#if !isChannelSocketConnected || channel.bans?.includes($page.data.user.userId)}
			<input
				class="animate-pulse block mx-2 p-2.5 w-full text-sm textarea textarea-bordered textarea-secondary"
				placeholder="Disabled"
				disabled />
		{:else}
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
		{/if}
	</div>
</form>
