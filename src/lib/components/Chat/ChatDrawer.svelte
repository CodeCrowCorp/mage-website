<script lang="ts">
	import { onMount } from 'svelte'
	import ChatInput from '$lib/components/Chat/ChatInput.svelte'
	import ChatMessage from '$lib/components/Chat/ChatMessage.svelte'

	export let showDrawer: boolean
	export let channel: any = undefined

	let username = 'Gagan',
		message =
			'Hello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello WorldHello World'

	let sender = { username, message }

	let youSender = { username: 'Singh', message: 'hewrewrwe ehe' }
	let modSender = { username: 'Moderator', message: 'hewe rew rwe rwhe' }
	let otherSender = { username: 'Randos', message: 'he wer wer wehe' }

	onMount(async () => {
		// if (!$tags.length) {
		// 	await getTags()
		// }
	})

	const sendMessage = async () => {
		// await createChannel(newChannel)
	}
</script>

<div class="drawer drawer-end absolute w-full z-20 top-0 right-0">
	<input id="create-channel-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => (showDrawer = false)} class="drawer-overlay" />
		<div class="bg-base-200 flex flex-col">
			<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
				{channel.title || 'Chat'}
			</p>

			<div class="flex flex-col-reverse p-3 grow h-80 overflow-y-auto">
				<ChatMessage bind:sender />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={youSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={modSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={otherSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={youSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={modSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={otherSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={youSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={modSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={otherSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={youSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={modSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={otherSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={youSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={modSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={otherSender} />
				<ChatMessage bind:sender={youSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={modSender} />
				<ChatMessage bind:sender />
				<ChatMessage bind:sender={otherSender} />
			</div>

			<div class="flex flex-row mt-auto p-3 w-full">
				<ChatInput />
			</div>
		</div>
	</div>
</div>
