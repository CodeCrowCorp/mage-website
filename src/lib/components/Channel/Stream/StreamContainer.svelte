<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import IconChatDrawerChevronOpen from '$lib/assets/icons/channel/IconChatDrawerChevronOpen.svelte'
	import IconChatDrawerChevronClose from '$lib/assets/icons/channel/IconChatDrawerChevronClose.svelte'
	import IconSocialTwitch from '$lib/assets/icons/social/IconSocialTwitch.svelte'
	import IconSocialYouTube from '$lib/assets/icons/social/IconSocialYouTube.svelte'
	import IconViews from '$lib/assets/icons/IconViews.svelte'
	import StreamControls from '$lib/components/Channel/Stream/StreamControls.svelte'
	import DropdownViewers from '$lib/components/Channel/Stream/DropdownViewers.svelte'
	import VideoGrid from '$lib/components/Channel/Stream/VideoGrid.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'
	import {
		is_sharing_rtmps,
		is_sharing_audio,
		is_sharing_webcam,
		is_sharing_screen
	} from '$lib/stores/streamStore'
	import { getNumberInThousands } from '$lib/utils'
	import {
		is_chat_drawer_open,
		is_chat_drawer_destroy,
		was_chat_drawer_closed
	} from '$lib/stores/channelStore'
	import {
		is_feature_merge_platforms_enabled,
		is_feature_premium_enabled
	} from '$lib/stores/remoteConfigStore'
	import DropdownSponsors from '$lib/components/Channel/Stream/DropdownSponsors.svelte'
	import IconChatSponsor from '$lib/assets/icons/chat/IconChatSponsor.svelte'

	const dispatch = createEventDispatcher()
	export let userCount: number = 1,
		channel: any,
		channels: any = [],
		isHostOrGuest: boolean = false,
		viewers: any[] = []

	let isScrollable = false
	$: isLive =
		channel.videoItems?.some(
			(input: any) =>
				input?.rtmps?.isConnected ||
				input?.screen?.isConnected ||
				input?.webcam?.isConnected ||
				input?.audio?.isConnected
		) ?? false

	function autoActive(node: Element) {
		const observer = new IntersectionObserver(callback, { threshold: 0.5 })
		observer.observe(node)

		function callback(entries: IntersectionObserverEntry[]) {
			const entry = entries.find((entry) => entry.isIntersecting)
			if (entry) {
				const id = parseInt(entry.target.id)
				channel = channels?.filter((channel: any) => channel?._id === id)[0]
				if (channels?.length && channels[channels.length - 2]?._id == id) {
					dispatch('loadMore')
				}

				goto(`${id}?${$page.url?.searchParams}`, {
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
		$is_sharing_rtmps ||
		$is_sharing_screen ||
		$is_sharing_webcam ||
		$is_sharing_audio
			? 'overflow-y-hidden'
			: ''}">
		{#each channels as nextchannel}
			<div class="carousel-item h-full" id={nextchannel?._id} use:autoActive>
				<div class="flex flex-col w-full m-3">
					<div class="flex gap-2 mb-3">
						<button
							class="btn btn-sm btn-neutral font-medium text-white border-none flex items-center bg-red-700 hover:bg-red-700"
							disabled={!isLive}>
							LIVE
						</button>
						<div
							class="tooltip tooltip-bottom"
							data-tip="{getNumberInThousands(channel.viewCount || 0)} views">
							<span class="btn btn-sm btn-neutral font-medium gap-2 text-white border-none">
								<IconViews />
								{getNumberInThousands(channel.viewCount || 0)}
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
						{#if $is_feature_premium_enabled && channel.sponsors?.length}
							<div
								class="dropdown dropdown-bottom tooltip tooltip-bottom"
								data-tip="{getNumberInThousands(channel.sponsors?.length || 0)} sponsors">
								<label
									for=""
									class="btn btn-sm font-medium gap-2 btn-accent border-none"
									tabindex="-1">
									<IconChatSponsor />
									{getNumberInThousands(channel.sponsors?.length || 0)}
								</label>
								<DropdownSponsors {channel} />
							</div>
						{/if}
						{#if $is_feature_merge_platforms_enabled}
							{#if channel.platforms}
								{#each channel.platforms as platform}
									<span
										class="btn btn-sm btn-neutral font-medium text-white border-none flex items-center tooltip tooltip-bottom"
										data-tip={platform.name}>
										{#if platform.name === 'Twitch'}
											<IconSocialTwitch />
										{:else if platform.name === 'YouTube'}
											<IconSocialYouTube />
										{/if}
										{getNumberInThousands(platform.count || 0)}
									</span>
								{/each}
							{/if}
						{/if}
						<label class="swap swap-rotate ml-auto">
							<input type="checkbox" bind:checked={$is_chat_drawer_open} />
							<IconChatDrawerChevronOpen />
							<IconChatDrawerChevronClose />
						</label>
					</div>
					{#if channel && nextchannel?._id === parseInt($page.params.channelId)}
						<VideoGrid bind:channel />
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<div class="absolute lg:bottom-0 bottom-10 m-3 w-full items-center justify-center flex">
		<StreamControls bind:isHostOrGuest bind:channel bind:isScrollable bind:viewers />
	</div>
</div>
