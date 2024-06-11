<script lang="ts">
	import { get } from '$lib/api'
	import { getTimeFormat, timeSince } from '$lib/utils'
	import { onMount } from 'svelte'
	import DialogVod from './DialogVod.svelte'
	import { is_vod_modal_open } from '$lib/stores/channelStore'

	export let channelId: number
	let vods: any = [],
		selectedVod: any

	onMount(async () => {
		await getVods()
	})

	const getVods = async () => {
		vods = await get(`vods?channelId=${channelId}`)
	}
</script>

{#if vods?.length}
	<div class="flex space-x-4 bg-base-200 rounded-md overflow-x-auto h-52 overflow-y-hidden p-4">
		{#each vods as vod}
			<div
				class="flex flex-none cursor-pointer relative"
				on:click={() => {
					$is_vod_modal_open = true
					selectedVod = vod
				}}>
				<!-- <iframe src={vod.url} class="rounded-box"></iframe> -->
				<img loading="eager" src={vod.thumbnail} class="rounded-md" alt="vod thumbnail" />
				<span
					class="badge badge-md text-ghost rounded-md font-semibold border-none absolute m-1 bottom-0"
					>{timeSince(vod.createdAt)}</span>
				<!-- <span class="badge badge-md text-ghost rounded-md font-semibold border-none absolute m-1"
					>@{vod.username}</span> -->
				<div
					class="badge badge-md text-ghost rounded-md font-semibold border-none absolute bottom-0 right-0 m-1">
					{getTimeFormat(vod.duration)}
				</div>
			</div>
		{/each}
	</div>
	<DialogVod vod={selectedVod} />
{/if}
