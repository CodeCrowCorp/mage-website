<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import { timeSince } from '$lib/utils'
	import Avatar from '$lib/components/Global/Avatar.svelte'
	import { goto } from '$app/navigation'

	export let item: any
</script>

<a href={`/channel/${item._id}`} class="menu p-4 bg-base-100 rounded-md hover:bg-base-300">
	<div class="flex flex-col md:flex-row gap-4 w-full">
		<div class="min-w-[20rem] relative">
			<div class="absolute flex gap-2 m-2">
				{#if item.isLive}
					<span
						class="btn btn-sm rounded-md font-medium text-white border-none flex items-center bg-red-700 hover:bg-red-700">
						LIVE
					</span>
				{/if}
				<label
					for=""
					class="btn btn-sm rounded-md font-medium gap-2 text-white border-none"
					tabindex="-1">
					<IconViewers />
					{item.memberCount || '0'}
				</label>
			</div>
			<img
				loading="lazy"
				src={item.thumbnail ? item.thumbnail : '/placeholder/programming-placeholder.jpg'}
				class="h-64 w-full object-cover rounded shadow"
				alt="channel thumbnail" />
		</div>
		<div class="flex-auto flex flex-col gap-2">
			<div class="flex flex-wrap">
				{#if item.category && item.category.length}
					{#each item.category as category}
						<div class="tooltip" data-tip={category}>
							<img src={$category_list[category]} alt="category icon" class="h-10 w-10 m-1" />
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
					<div class="w-12 mask {item?.planTier > 0 ? 'mask-hexagon' : 'mask-squircle'}">
						<Avatar avatar={item.avatar} username={item.username} className="w-12" />
					</div>
				</div>
				<span class="ml-2 link link-hover flex gap-1" on:click={() => goto(`/${item.username}`)}
					>@{item.username || ''}
					{#if item.planTier > 0}
						<div class="text-accent font-bold">
							<IconDrawerVerification />
						</div>
					{/if}</span>
			</div>

			<div class="flex flex-wrap gap-2 my-1">
				{#if item.tags && item.tags.length}
					{#each item.tags as tag}
						<div>
							<span class="badge badge-md text-secondary rounded-md font-semibold border-none"
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
