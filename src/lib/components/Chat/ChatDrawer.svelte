<script lang="ts">
	import ChatInput from '$lib/components/Chat/ChatInput.svelte'
	import ChatMessage from '$lib/components/Chat/ChatMessage.svelte'

	export let showDrawer: boolean,
		channel: any = undefined,
		chatHistory: any = []
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
