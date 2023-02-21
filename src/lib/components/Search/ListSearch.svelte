<script lang="ts">
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import ItemSearch from '$lib/components/Search/ItemSearch.svelte'
	import ItemSection from '$lib/components/Search/ItemSection.svelte'
	export let channels: any = [],
		loadingMoreChannels: boolean = false,
		isSearchPage: boolean = false
</script>

<div class="flex flex-col gap-4 px-4 md:px-24 justify-around">
	{#each channels as channel}
		{#if channel.isPrivate !== true}
			{#if isSearchPage}
				<ItemSearch {channel} />
			{:else}
				<ItemSection {channel} />
			{/if}
		{/if}
	{:else}
		<h2>No records found</h2>
	{/each}
	{#if loadingMoreChannels}
		<div class="flex justify-center items-center pb-8">
			<div
				class="w-12 h-12 rounded-full animate-spin border border-solid border-black dark:border-white border-t-transparent" />
		</div>
	{/if}
	<span use:LastItemInViewport on:loadMore />
</div>
