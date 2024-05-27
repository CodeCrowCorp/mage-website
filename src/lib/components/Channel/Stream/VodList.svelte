<script lang="ts">
	import { get } from '$lib/api'
	import { getTimeFormat } from '$lib/utils'
	import { onMount } from 'svelte'

	export let channelId: number
	let vods: any = []

	onMount(async () => {
		vods = await get(`vods?channelId=${channelId}`)
		console.log('got here----vods', vods)
	})
</script>

{#if vods.length}
	<div class="flex space-x-1 bg-base-200 rounded-box overflow-x-auto h-52 overflow-y-hidden">
		{#each vods as vod}
			<a class="carousel-item p-4 cursor-pointer relative" href={vod.url} target="_blank">
				<!-- <iframe src={vod.url} class="rounded-box"></iframe> -->
				<img src={vod.thumbnail} class="rounded-box" />
				<div
					class="badge badge-md text-ghost rounded-md font-semibold border-none absolute bottom-4 right-4 m-1">
					{getTimeFormat(vod.duration)}
				</div>
			</a>
		{/each}
	</div>
{:else}
	<p>No VODs available</p>
{/if}
