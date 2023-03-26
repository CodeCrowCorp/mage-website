<script lang="ts">
	import VideoItem from '$lib/components/Channel/Stream/VideoItem.svelte'
	import { divideNumber, cardCounts } from '$lib/utils'
	import { video_items } from '$lib/stores/streamStore'
	// const rows = cardCounts[videoCount]
</script>

<!-- create a grid layout of video items centered and responsive with maximum 4 in a gridd and scrolling more horizontally -->
<div class="carousel h-full pb-6">
	{#each divideNumber($video_items.length, 16) as videos}
		<div class="carousel-item w-full">
			<div class="flex flex-col h-full w-full">
				{#each cardCounts[videos] as row}
					<div class="flex flex-row max-h-60 gap-4 justify-center h-full mt-3">
						{#each Array(row) as _, i}
							<VideoItem video={$video_items[i]} />
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
