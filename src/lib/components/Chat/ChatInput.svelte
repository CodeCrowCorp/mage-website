<script>
	import IconChatAttachment from '$lib/assets/icons/chat/IconChatAttachment.svelte'
	import IconChatEmoji from '$lib/assets/icons/chat/IconChatEmoji.svelte'
	import IconChatGif from '$lib/assets/icons/chat/IconChatGif.svelte'
	import IconChatCode from '$lib/assets/icons/chat/IconChatCode.svelte'
</script>

<form class="rounded-lg bg-base-100 p-2">
	<label for="chat" class="sr-only">Your message</label>
	<button
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
	</button>
	<div class="flex items-center py-2 rounded-lg">
		<textarea
			id="chat"
			rows="1"
			class="focus:h-32 block mx-2 p-2.5 w-full text-sm textarea textarea-bordered textarea-secondary"
			placeholder="Your message..." />
		<button
			type="submit"
			class="inline-flex justify-center p-2 text-secondary rounded-full cursor-pointer ">
			<svg
				aria-hidden="true"
				class="w-6 h-6 rotate-90"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
			<span class="sr-only">Send message</span>
		</button>
	</div>
</form>
