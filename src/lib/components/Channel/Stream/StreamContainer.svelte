<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import StreamControls from '$lib/components/Channel/Stream/StreamControls.svelte'
	import DropdownViewers from '$lib/components/Channel/Stream/DropdownViewers.svelte'
	import VideoGrid from '$lib/components/Channel/Stream/VideoGrid.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'
	import { is_chat_drawer_open } from '$lib/stores/channelStore'

	const dispatch = createEventDispatcher()
	export let count: number = 10,
		channel: any,
		channels: any = []

	function autoActive(node: Element) {
		const observer = new IntersectionObserver(callback, { threshold: 0.5 })
		observer.observe(node)

		function callback(entries: IntersectionObserverEntry[]) {
			const entry = entries.find((entry) => entry.isIntersecting)
			if (entry) {
				const id = entry.target.id
				channel = channels?.filter((channel: any) => channel?._id === id)[0]
				if (channels?.length && channels[channels.length - 2]['_id'] == id) {
					dispatch('loadMore')
				}

				goto(`${id}`, {
					keepFocus: true,
					replaceState: true,
					noScroll: true
				})
			}
		}

		return { destroy: () => observer.disconnect() }
	}
</script>

<div class="flex justify-center h-full">
	<div class="carousel carousel-vertical rounded-lg bg-base-100 w-full m-5 mb-24">
		<!-- <div
			class="carousel-item h-full p-3 {$is_chat_drawer_open ? 'w-[70%]' : ''}"
			id={channel?._id}
			use:autoActive>
			<div class="flex flex-col w-full">
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
				</div>
				<VideoGrid />
			</div>
		</div> -->

		{#each channels as nextchannel}
			<div
				class="carousel-item h-full p-3 {$is_chat_drawer_open ? 'w-[70%]' : ''}"
				id={nextchannel?._id}
				use:autoActive>
				<div class="flex flex-col w-full">
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
					</div>
					<VideoGrid />
				</div>
			</div>
		{/each}
	</div>

	<div class="absolute bottom-0 m-5">
		<StreamControls isHost={channel?.user === $page?.data?.user?.userId} bind:channel />
	</div>
</div>
