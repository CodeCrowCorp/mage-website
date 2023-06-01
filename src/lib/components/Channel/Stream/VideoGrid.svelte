<script lang="ts">
	import VideoItem from '$lib/components/Channel/Stream/VideoItem.svelte'
	import { getVideoGrids } from '$lib/utils'
	import { video_items } from '$lib/stores/streamStore'

	export let channel: any

	$: grid = getVideoGrids($video_items, 9)
</script>

{#if $video_items?.length}
	<div class="carousel h-full pb-6">
		<div class="carousel-item w-full h-full">
			<div class="flex flex-col h-full w-full">
				{#each grid as row}
					<div class="flex flex-row gap-4 justify-center h-full mt-3">
						{#each row as video}
							<VideoItem bind:video {channel} />
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
