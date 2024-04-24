<script lang="ts">
	import IconViews from '$lib/assets/icons/IconViews.svelte'
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import { getNumberInThousands } from '$lib/utils'

	export let channel: any = {}

	const handleError = (e: any) => {
		const imgElement = e.target
		if (imgElement instanceof HTMLImageElement) {
			imgElement.src = '/placeholder/programming-placeholder.jpg'
		}
	}
</script>

<a
	class="flex flex-col w-[20rem] md:w-[27rem] p-4 bg-base-100 hover:bg-base-300 rounded-md shrink-0 my-4"
	href="/channel/{channel._id}">
	<div class="relative">
		<div class="flex flex-row justify-between">
			<div class="flex gap-2 mb-3">
				{#if channel.isLive}
					<span
						class="btn btn-sm rounded-md font-medium text-white border-none flex items-center bg-red-700 hover:bg-red-700">
						LIVE
					</span>
				{/if}
				<div class="tooltip" data-tip="{getNumberInThousands(channel.viewCount || 0)} views">
					<span class="btn btn-sm rounded-md font-medium gap-2 btn-neutral text-white border-none">
						<IconViews />
						{getNumberInThousands(channel.viewCount || 0)}
					</span>
				</div>
				<div class="tooltip" data-tip="{getNumberInThousands(channel.memberCount || 0)} watching">
					<span class="btn btn-sm rounded-md font-medium gap-2 btn-neutral text-white border-none">
						<IconViewers />
						{getNumberInThousands(channel.memberCount || 0)}
					</span>
				</div>
			</div>
			<div class="flex flex-wrap">
				{#if channel.category && channel.category.length}
					{#each channel.category as category}
						<div class="tooltip" data-tip={category}>
							<img src={$category_list[category]} alt="" class="h-7 w-7 m-1" />
						</div>
					{/each}
				{/if}
			</div>
		</div>
		<div class="video-thumbnail">
			<img
				class="w-full h-full mask rounded-lg object-cover"
				alt="channel thumbnail"
				src={channel.thumbnail ? channel.thumbnail : '/placeholder/programming-placeholder.jpg'}
				on:error={handleError} />
		</div>
	</div>
	<p class="text-lg font-semibold truncate">{channel.title}</p>
	<div class="flex flex-row gap-2 max-w-[25rem]">
		<div class="avatar">
			<div class="w-12 mask {channel?.planTier > 0 ? 'mask-hexagon' : 'mask-squircle'}">
				<img src={channel.avatar} alt="user avatar" />
			</div>
		</div>
		<div class="flex items-center gap-1">
			<p>@{channel.username}</p>
			{#if channel.planTier > 0}
				<div class="text-accent font-bold">
					<IconDrawerVerification />
				</div>
			{/if}
		</div>
	</div>
</a>

<style>
	.video-thumbnail {
		@apply w-full h-64 flex items-center justify-center mb-2;
	}
</style>
