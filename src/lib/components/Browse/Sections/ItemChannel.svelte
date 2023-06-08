<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import { category_list } from '$lib/stores/channelStore'

	export let channel: any = {}
</script>

<ul class="p-4 bg-neutral-focus hover:bg-neutral shrink-0 mt-6 rounded-md">
	<li>
		<a
			class="flex flex-col w-[20rem] md:w-[25rem] rounded-md items-stretch"
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
						<div class="dropdown dropdown-bottom">
							<label
								for=""
								class="btn btn-sm rounded-md font-medium gap-2 text-white border-none"
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
				<div class="video-thumbnail">
					<img
						class="w-full h-full mask rounded-lg object-cover"
						src={channel.thumbnail
							? channel.thumbnail
							: '/placeholder/programming-placeholder.jpg'} />
				</div>
			</div>
			<p class="text-lg font-semibold truncate">{channel.title}</p>
			<div class="flex flex-row gap-2 max-w-[25rem]">
				<div class="avatar">
					<div class="w-12 mask mask-squircle">
						<img src={channel.avatar} alt="" />
					</div>
				</div>
				<div class="flex items-center">
					<p>@{channel.createdByUsername}</p>
				</div>
			</div>
		</a>
	</li>
</ul>

<style>
	.video-thumbnail {
		@apply w-full h-64 flex items-center justify-center mb-2;
	}
</style>
