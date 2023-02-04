<script lang="ts">
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import ChatDrawer from '$lib/components/Chat/ChatDrawer.svelte'
	import type { PageData } from './$types'
	import { getChannelSocket } from '$lib/stores/socketStore'
	import { onMount } from 'svelte'

	export let data: PageData

	$: ({ post } = data)
	let showDrawer = false

	onMount(async () => {
		// await getChannelSocket({ channelId: post._id })
	})
</script>

<div class="flex flex-col md:flex-row gap-4 py-5 pl-5">
	<div class="form-control">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label
			for="create-channel-drawer"
			class="btn w-[21rem] btn-primary gap-2 drawer-button"
			on:click={() => (showDrawer = true)}>
			<IconCreate />
			Show Chat</label>
	</div>

	{#if showDrawer}
		<ChatDrawer bind:showDrawer bind:channel={post} />
	{/if}
</div>
