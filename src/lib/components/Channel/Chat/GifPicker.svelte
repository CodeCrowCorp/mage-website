<script lang="ts">
	import { onMount } from 'svelte'
	import IconChatGif from '$lib/assets/icons/chat/IconChatGif.svelte'
	import FloatingMenu from './FloatingMenu.svelte'

	import { page } from '$app/stores'
	import { get } from '$lib/api'

	export let onSelect: any, isChannelSocketConnected: any

	$: if (isChannelSocketConnected) {
		getTrending()
	}

	let gifs: { downsized_large: string; original: string; title: string }[] = []
	let searched: { downsized_large: string; original: string; title: string }[] = []
	let query: string = ''
	let loading = false

	onMount(async () => {})

	const getTrending = async () => {
		loading = true
		const resp = await get('giphy/trending', {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		if (resp && Array.isArray(resp)) gifs = resp
		loading = false
	}

	const onSearch = async (evt: any) => {
		query = evt.target.value
		loading = true
		const resp = await get('giphy/search?query=' + query, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		loading = false
		if (resp && Array.isArray(resp)) searched = resp
	}

	$: list = query ? searched : gifs
</script>

<FloatingMenu
	let:forceClose
	id="gif-picker"
	icon={IconChatGif}
	label="GIF"
	{isChannelSocketConnected}>
	<div class="gif-picker bg-base-300 flex flex-col rounded-md px-2">
		<div class="m-2">
			<input
				type="text"
				placeholder="Search here"
				class="input input-bordered input-sm w-full max-w-xs"
				on:input={onSearch}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault()
						onSearch(e)
					}
				}} />
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-4 w-full">
				<span class="loading loading-dots loading-sm" />
			</div>
		{:else if list.length}
			<div class="grid grid-cols-2 gap-2 flex-1 overflow-auto mt-2">
				{#each list as gif}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="cursor-pointer"
						on:click={() => {
							onSelect(gif.downsized_large)
							forceClose()
						}}>
						<img src={gif.downsized_large} alt="gif" class="w-full p-1" />
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex items-center justify-center py-4 w-full">
				<span class="text-sm text-neutral">No Items Found</span>
			</div>
		{/if}
	</div>
</FloatingMenu>

<style global>
	.gif-picker {
		width: 350px;
		height: 400px;
		max-width: 100%;
	}
</style>
