<script lang="ts">
	import IconPhoto from '$lib/assets/icons/IconPhoto.svelte'
	import { tags, getTags, createChannel } from '$lib/stores/channelStore'
	import { onMount } from 'svelte'
	import Tags from 'svelte-tags-input'
	import ChatInput from '$lib/components/Chat/ChatInput.svelte'

	export let showDrawer: boolean
	let title = 'Chat'

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
				{title || 'Chat'}
			</p>
			<div class="flex flex-col p-3" />

			<div class="flex flex-row mt-auto p-3 w-full">
				<ChatInput />
			</div>
		</div>
	</div>
</div>
