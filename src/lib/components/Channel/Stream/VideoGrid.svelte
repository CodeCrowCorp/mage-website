<script lang="ts">
	import VideoItem from '$lib/components/Channel/Stream/VideoItem.svelte'
	import { divideNumber, cardCounts } from '$lib/utils'
	import { video_items } from '$lib/stores/streamStore'

	export let channel: any

	const sender: any = {}
</script>

{#if $video_items?.length}
	<div class="carousel h-full pb-6">
		{#each divideNumber($video_items.length, 16) as videos}
			<div class="carousel-item w-full">
				<div class="flex flex-col h-full w-full">
					{#each cardCounts[videos] as row}
						<div class="flex flex-row max-h-80 gap-4 justify-center h-full mt-3">
							{#each Array(row) as _, i}
								<VideoItem bind:video={$video_items[i]} {channel} {sender} />
							{/each}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}
