<script lang="ts">
	import IconLink from '$lib/assets/icons/IconLink.svelte'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { category_list } from '$lib/stores/channelStore'

	export let item: any
</script>

<a href={`/profile/${item.username}`} class="menu p-4 bg-base-100 rounded-md hover:bg-base-300">
	<div class="flex-col md:flex-row gap-4 w-full contents">
		<div class="max-w-md">
			<div class="avatar">
				<div class="w-32 mask {item?.planDetails?.planTier > 1 ? 'mask-hexagon' : 'mask-squircle'}">
					<img loading="lazy" src={item.avatar} alt="" />
				</div>
			</div>
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
				{item.displayName || ''}
			</h2>
			<div class="flex items-center">
				<a class="link link-hover flex gap-1" href="/profile/{item.username}"
					>@{item.username || ''}
					<div class="text-accent font-bold">
						<IconDrawerVerification />
					</div>
				</a>
			</div>
			<h2 class="text-md">
				{item.bio || ''}
			</h2>
			{#if item.website}
				<div class="flex gap-2">
					<IconLink />
					<a class="link link-info" href={item.website} target="_blank" rel="noreferrer"
						>{item.website || ''}</a>
				</div>
			{/if}
		</div>
	</div>
</a>
