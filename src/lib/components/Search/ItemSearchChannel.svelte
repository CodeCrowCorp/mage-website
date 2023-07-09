<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import { timeSince } from '$lib/utils'

	export let item: any
</script>

<ul class="menu bg-base-100 rounded-md">
	<li>
		<a href={`/channel/${item._id}`}>
			<div class="flex flex-col md:flex-row gap-4 w-full">
				<div class="min-w-[20rem]">
					<div class="absolute flex gap-2 m-2">
						{#if item.isLive}
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
								{item.memberCount || '0'}
							</label>
						</div>
					</div>
					<img
						loading="lazy"
						src={item.thumbnail ? item.thumbnail : '/placeholder/programming-placeholder.jpg'}
						class="h-64 w-full object-cover rounded shadow"
						alt="" />
				</div>
				<div class="flex-auto flex flex-col gap-2">
					<div class="flex flex-wrap">
						{#if item.category && item.category.length}
							{#each item.category as category}
								<div class="tooltip" data-tip={category}>
									<img src={$category_list[category]} alt="" class="h-10 w-10 m-1" />
								</div>
							{/each}
						{/if}
					</div>

					<h2 class="text-xl font-semibold">
						{item.title || ''}
					</h2>

					<h2 class="text-md">
						{item.description || ''}
					</h2>

					<div class="flex items-center">
						<div class="avatar">
							<div class="w-12 mask {item?.isPaidPlan ? 'mask-hexagon' : 'mask-squircle'}">
								<img src={item.avatar} alt="" />
							</div>
						</div>
						<a class="ml-2 link link-secondary" href="/profile/{item.createdByUsername}"
							>@{item.createdByUsername || ''}</a>
					</div>

					<div class="flex flex-wrap gap-2 my-1">
						{#if item.tags && item.tags.length}
							{#each item.tags as tag}
								<div>
									<span
										class="badge badge-md text-primary bg-gray-200 rounded-md font-semibold border-none"
										>{tag}</span>
								</div>
							{/each}
						{/if}
					</div>

					<p class="text-sm font-light">
						{item.viewCount || 0} Views - {timeSince(item.createdAt)}
					</p>
				</div>
			</div>
		</a>
	</li>
</ul>
