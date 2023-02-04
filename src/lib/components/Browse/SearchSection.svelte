<script lang="ts">
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import SearchItem from '$lib/components/Browse/SearchItem.svelte'
</script>

<div class="flex flex-col gap-4 px-24 justify-around">
	<SearchItem />
	<SearchItem />
	<SearchItem />
	<SearchItem />
	<span use:LastItemInViewport on:load_more />
</div>
