<script lang="ts">
	import VideoItem from '$lib/components/Channel/Stream/VideoItem.svelte'
</script>

<!-- create a grid layout of video items centered and responsive with maximum 4 in a gridd and scrolling more horizontally -->
<div class="grid grid-cols-2 gap-4">
	{#each Array(3) as _, i}
		<VideoItem />
	{/each}
</div>
