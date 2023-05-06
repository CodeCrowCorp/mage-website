<script lang="ts">
	import { category_list } from '$lib/stores/channelStore'

	export let user: any = {}
</script>

<ul class="menu shrink-0 bg-base-100 rounded-md">
	<li>
		<a class="rounded-md" href="/profile/{user.username}">
			<div class="text-center space-y-3 max-w-[224px]">
				<div class="avatar">
					<div class="w-36 mask mask-squircle">
						<img src={user.avatar} alt="" />
					</div>
				</div>
				<div class="tooltip w-full" data-tip="@{user.username}">
					<p class="text-lg font-semibold truncate">@{user.username}</p>
				</div>
				<div class="flex flex-wrap">
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
	</li>
</ul>
