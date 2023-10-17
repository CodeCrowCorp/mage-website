<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import IconChatDrawerChevronOpen from '$lib/assets/icons/channel/IconChatDrawerChevronOpen.svelte'
	import IconChatDrawerChevronClose from '$lib/assets/icons/channel/IconChatDrawerChevronClose.svelte'
	import IconViews from '$lib/assets/icons/IconViews.svelte'
	import StreamControls from '$lib/components/Channel/Stream/StreamControls.svelte'
	import DropdownViewers from '$lib/components/Channel/Stream/DropdownViewers.svelte'
	import VideoGrid from '$lib/components/Channel/Stream/VideoGrid.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'
	import {
		is_sharing_obs,
		is_sharing_audio,
		is_sharing_screen,
		is_sharing_webcam
	} from '$lib/stores/streamStore'
	import { getNumberInThousands } from '$lib/utils'
	import {
		is_chat_drawer_open,
		is_chat_drawer_destroy,
		was_chat_drawer_closed
	} from '$lib/stores/channelStore'

	const dispatch = createEventDispatcher()
	export let userCount: number = 1,
		channel: any,
		channels: any = [],
		isHostOrGuest: boolean = false,
		viewers: any[] = []

	let isScrollable = false

	function autoActive(node: Element) {
		const observer = new IntersectionObserver(callback, { threshold: 0.5 })
		observer.observe(node)

		function callback(entries: IntersectionObserverEntry[]) {
			const entry = entries.find((entry) => entry.isIntersecting)
			if (entry) {
				const id = entry.target.id
				channel = channels?.filter((channel: any) => channel?._id === id)[0]
				if (channels?.length && channels[channels.length - 2]?._id == id) {
					dispatch('loadMore')
				}

				goto(`${id}`, {
					keepFocus: true,
					replaceState: true,
					noScroll: true,
					invalidateAll: true
				})
			}
		}

		return { destroy: () => observer.disconnect() }
	}

	$: handleChatDrawer()

	const handleChatDrawer = () => {
		if ($is_chat_drawer_open) {
			$is_chat_drawer_open = false
			$was_chat_drawer_closed = true
			setTimeout(() => {
				$is_chat_drawer_destroy = true
			}, 300)
			return
		}

		$is_chat_drawer_destroy = false
		setTimeout(() => {
			$is_chat_drawer_open = !$is_chat_drawer_open
		}, 100)
	}
</script>

<div class="flex justify-center h-full">
	<div
		class="carousel carousel-vertical rounded-lg bg-base-100 w-full m-5 mb-24 {isScrollable ||
		$is_sharing_obs ||
		$is_sharing_screen ||
		$is_sharing_webcam ||
		$is_sharing_audio
			? 'overflow-y-hidden'
			: ''}">
		{#each channels as nextchannel}
			<div class="carousel-item h-full p-3" id={nextchannel?._id} use:autoActive>
				<div class="flex flex-col w-full">
					<div class="flex gap-2 mb-3">
						<span
							class="btn btn-sm btn-neutral font-medium text-white border-none flex items-center {channel
								.videoItems?.length
								? 'bg-red-700 hover:bg-red-700'
								: ''}">
							LIVE
						</span>
						<div
							class="tooltip tooltip-bottom"
							data-tip="{getNumberInThousands(channel.viewDetails?.count || 0)} views">
							<span class="btn btn-sm btn-neutral font-medium gap-2 text-white border-none">
								<IconViews />
								{getNumberInThousands(channel.viewDetails?.count || 0)}
							</span>
						</div>
						<div
							class="dropdown dropdown-bottom tooltip tooltip-bottom"
							data-tip="{getNumberInThousands(userCount || 0)} watching">
							<label
								for=""
								class="btn btn-sm btn-neutral font-medium gap-2 text-white border-none"
								tabindex="-1">
								<IconViewers />
								{getNumberInThousands(userCount || 0)}
							</label>
							<DropdownViewers {channel} bind:viewers />
						</div>
						<label class="swap swap-rotate ml-auto">
							<input type="checkbox" bind:checked={$is_chat_drawer_open} />
							<IconChatDrawerChevronOpen />
							<IconChatDrawerChevronClose />
						</label>
					</div>
					{#if channel && nextchannel?._id === $page.params.channelId}
						<VideoGrid bind:channel />
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<div class="absolute lg:bottom-0 bottom-10 m-3 w-full items-center justify-center flex">
		<StreamControls bind:isHostOrGuest bind:channel bind:isScrollable />
	</div>
</div>
