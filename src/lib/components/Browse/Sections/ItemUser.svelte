<script lang="ts">
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { category_list } from '$lib/stores/channelStore'

	export let user: any = {}
</script>

<a class="p-4 bg-base-100 hover:bg-base-300 shrink-0 rounded-md my-4" href="/{user.username}">
	<div class="text-center space-y-3 w-[200px]">
		<div class="avatar">
			<div class="w-36 mask {user?.planTier > 0 ? 'mask-hexagon' : 'mask-squircle'}">
				<img src={user.avatar} alt="" />
			</div>
		</div>
		<div class="tooltip w-full flex gap-1 justify-center" data-tip="@{user.username}">
			<p class="text-lg font-semibold truncate">
				@{user.username}
			</p>
			{#if user.planTier > 0}
				<div class="text-accent font-bold">
					<IconDrawerVerification />
				</div>
			{/if}
		</div>
		<div class="w-full">
			{#if user.category && user.category.length}
				{#each user.category as category}
					<div class="tooltip" data-tip={category}>
						<img src={$category_list[category]} alt="" class="h-10 w-10 m-1" />
					</div>
				{/each}
			{/if}
		</div>
	</div>
</a>
