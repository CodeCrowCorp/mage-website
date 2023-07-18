<script lang="ts">
	import VideoItem from '$lib/components/Channel/Stream/VideoItem.svelte'
	import { getVideoGrids } from '$lib/utils'
	import CommandList from '$lib/components/Channel/Stream/CommandList.svelte'

	export let channel: any

	$: grid = getVideoGrids(channel.videoItems, 9)
</script>

{#if channel.videoItems?.length}
	<div class="carousel h-full pb-6">
		<div class="carousel-item w-full h-full">
			<div class="flex flex-col h-full w-full">
				{#each grid as row}
					<div class="flex flex-row gap-4 justify-center h-full">
						{#each row as video}
							<VideoItem bind:video {channel} />
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<CommandList />
{/if}
