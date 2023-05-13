<script lang="ts">
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import ItemSearch from '$lib/components/Search/ItemSearch.svelte'

	export let channels: any = []
</script>

<div class="flex flex-col gap-4 px-4 md:px-24 justify-around">
	{#each channels as channel}
		<ItemSearch {channel} />
	{:else}
		<h2>No records found</h2>
	{/each}
	<span use:LastItemInViewport on:loadMore />
</div>
