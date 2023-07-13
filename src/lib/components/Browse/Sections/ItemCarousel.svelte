<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	// import IconBrowseItemPlay from '$lib/assets/icons/browse/IconBrowseItemPlay.svelte'
	import { category_list } from '$lib/stores/channelStore'

	export let channel: any = {}

	let bg_cover = channel.thumbnail || '/placeholder/programming-placeholder.jpg'
</script>

<a
	class="swiper-slide rounded-md"
	href="/channel/{channel._id}"
	style="background-image: url({bg_cover});">
	<div class="flex flex-col justify-between p-3 w-full h-full">
		<div class="flex flex-row justify-between">
			<div class="flex gap-2 mb-3">
				{#if channel.isLive}
					<span
						class="btn btn-sm rounded-md font-medium text-white border-none flex items-center bg-red-700 hover:bg-red-700">
						LIVE
					</span>
				{/if}
				<div class="dropdown dropdown-bottom">
					<label
						for=""
						class="btn btn-sm rounded-md font-medium gap-2 btn-neutral text-white border-none"
						tabindex="-1">
						<IconViewers />
						{channel.memberCount || '0'}
					</label>
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
		<!-- <div class="flex justify-center w-full">
			<IconBrowseItemPlay />
		</div> -->
		<div class="space-y-2">
			<p class="text-2xl truncate text-white font-semibold">{channel.title || ''}</p>
			<div class="flex flex-row items-center gap-2">
				<div class="avatar">
					<div class="w-14 mask {channel.isPaidPlan ? 'mask-hexagon' : 'mask-squircle'}">
						<img src={channel.thumbnail || channel.avatar} alt="" />
					</div>
				</div>
				<div class="w-4/5">
					<p class="truncate text-white">
						@{channel.createdByUsername}
					</p>
				</div>
			</div>
		</div>
	</div>
</a>
