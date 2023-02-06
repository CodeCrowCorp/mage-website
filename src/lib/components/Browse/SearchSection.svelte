<script lang="ts">
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import SearchItem from '$lib/components/Browse/SearchItem.svelte'
	import SearchSkeleton from '$lib/components/Skeleton/SearchSkeleton.svelte'
	import { searchingChannel } from '$lib/stores/channelStore'

	export let channels: []
</script>

<div class="flex flex-col gap-4 px-24 justify-around">
	{#if $searchingChannel}
		<SearchSkeleton />
		<SearchSkeleton />
		<SearchSkeleton />
	{:else}
		{#each channels as channel}
			{#if channel.isPrivate !== true}
				<SearchItem {channel} />
			{/if}
		{/each}
		<span use:LastItemInViewport on:load_more />
	{/if}
</div>
