<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import StreamControls from '$lib/components/Channel/Stream/StreamControls.svelte'
	import DropdownViewers from '$lib/components/Channel/Stream/DropdownViewers.svelte'
	import VideoGrid from '$lib/components/Channel/Stream/VideoGrid.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()
	export let count: number = 10,
		channel: any,
		channels: any = []

	function autoActive(node: Element) {
		const observer = new IntersectionObserver(callback)
		observer.observe(node)

		function callback(entries: IntersectionObserverEntry[]) {
			const entry = entries.find((entry) => entry.isIntersecting)
			if (entry) {
				const id = entry.target.id
				if (channels[channels.length - 2]['_id'] == id) {
					// load more channels here
					dispatch('loadMore')
				}
				// goto(`${id}`, { replaceState: true, noScroll: true })
			}
		}

		return { destroy: () => observer.disconnect() }
	}
</script>

<div class="flex justify-center h-full">
	<div class="carousel carousel-vertical rounded-lg bg-base-100 w-full m-5 mb-24">
		{#each channels as nextchannel}
			<div class="carousel-item h-full p-3" id={nextchannel?._id} use:autoActive>
				<div>
					<div class="flex gap-2 mb-3">
						<span
							class="btn-sm bg-red-700 rounded-md font-medium text-white border-none flex items-center">
							LIVE
						</span>
						<div class="dropdown dropdown-bottom">
							<label
								for=""
								class="btn btn-sm rounded-md font-medium gap-2 text-white border-none"
								tabindex="-1">
								<IconViewers />
								{count}
							</label>
							<DropdownViewers />
						</div>

						<span>
							{nextchannel?._id}
						</span>
					</div>
					<VideoGrid />
				</div>
			</div>
		{/each}
	</div>

	<div class="absolute bottom-0 m-5">
		<StreamControls />
	</div>
</div>
