<script lang="ts">
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import Favicon from '$lib/components/Profile/Favicon.svelte'

	export let item: any
</script>

<a href={`/${item.username}`} class="menu p-4 bg-base-100 rounded-md hover:bg-base-300">
	<div class="flex-col md:flex-row gap-4 w-full contents">
		<div class="max-w-md">
			<div class="avatar">
				<div class="w-32 mask {item?.planTier > 0 ? 'mask-hexagon' : 'mask-squircle'}">
					<img loading="lazy" src={item.avatar} alt="" />
				</div>
			</div>
		</div>
		<div class="flex-auto flex flex-col gap-2">
			{#if item.category?.length}
				<div class="flex flex-wrap">
					{#each item.category as category}
						<div class="tooltip" data-tip={category}>
							<img src={$category_list[category]} alt="" class="h-10 w-10 m-1" />
						</div>
					{/each}
				</div>
			{/if}

			<h2 class="text-xl font-semibold">
				{item.displayName || ''}
			</h2>
			<div class="flex items-center">
				<a class="link link-hover flex gap-1" href="/{item.username}"
					>@{item.username || ''}
					{#if item.planTier > 0}
						<div class="text-accent font-bold">
							<IconDrawerVerification />
						</div>
					{/if}
				</a>
			</div>
			<h2 class="text-md">
				{item.bio || ''}
			</h2>
			{#if item.urls?.length}
				<div class="flex gap-2 items-center">
					{#each item.urls || [] as url, index (index)}
						{#if url}
							<div class="tooltip" data-tip={url}>
								<Favicon {url} />
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</a>
