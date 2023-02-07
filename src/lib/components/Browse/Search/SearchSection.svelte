<script lang="ts">
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import SearchItem from '$lib/components/Browse/Search/SearchItem.svelte'
	import LoadingSearchChannel from '$lib/components/Browse/Search/LoadingSearchChannel.svelte'
	export let channels: any = []
	export let loadingSearchItems: boolean = false
	export let loadingMoreChannels: boolean = false
</script>

<div class="flex flex-col gap-4 px-4 md:px-24 justify-around">
	{#if loadingSearchItems}
		<LoadingSearchChannel />
		<LoadingSearchChannel />
		<LoadingSearchChannel />
	{:else}
		{#each channels as channel}
			{#if channel.isPrivate !== true}
				<SearchItem {channel} />
			{/if}
		{/each}
		{#if loadingMoreChannels}
			<div class="flex justify-center items-center pb-8">
				<div
					class="w-12 h-12 rounded-full animate-spin border border-solid border-black border-t-transparent" />
			</div>
		{/if}
		<span use:LastItemInViewport on:load_more />
	{/if}
</div>
