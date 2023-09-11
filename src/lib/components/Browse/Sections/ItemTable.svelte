<script lang="ts">
	import IconViews from '$lib/assets/icons/IconViews.svelte'
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import { goto } from '$app/navigation'
	import { category_list } from '$lib/stores/channelStore'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { getNumberInThousands } from '$lib/utils'
	export let channel: any = {}
</script>

<tr
	class="cursor-pointer hover:btn-ghost border border-transparent"
	on:click|preventDefault={() => goto(`/channel/${channel._id}`)}>
	<td>
		<div class="flex items-center space-x-2 my-3 pl-3">
			<div class="avatar">
				<div
					class="w-12 mask {channel.planDetails?.planTier > 1 ? 'mask-hexagon' : 'mask-squircle'}">
					<img src={channel.userDetails.avatar} alt="" />
				</div>
			</div>
			<div>
				<div class="font-bold">{channel.userDetails.displayName || ''}</div>
				<div class="text-sm flex gap-1">
					@{channel.userDetails.username || ''}
					{#if channel.planDetails?.planTier > 1}
						<div class="text-accent font-bold">
							<IconDrawerVerification />
						</div>
					{/if}
				</div>
			</div>
		</div>
	</td>
	<td>
		<div class="my-3">
			{channel.title}
			<br />
			<span class="text-sm">{channel.description}</span>
		</div>
	</td>
	<td>
		<div class="flex gap-4">
			<div
				class="flex gap-2 my-3 tooltip"
				data-tip="{getNumberInThousands(channel.viewDetails?.count || 0)} views">
				<IconViews />
				<span>{getNumberInThousands(channel.viewDetails?.count || 0)}</span>
			</div>
			<div
				class="flex gap-2 my-3 tooltip"
				data-tip="{getNumberInThousands(channel.memberCount || 0)} watching">
				<IconViewers />
				<span>{getNumberInThousands(channel?.memberCount || 0)}</span>
			</div>
		</div>
	</td>
	<td>
		<div class="flex flex-wrap gap-2 my-3">
			{#if channel.tags && channel.tags.length}
				{#if channel.isLive}
					<div>
						<span class="badge badge-md text-white bg-red-700 rounded-md font-semibold border-none"
							>LIVE</span>
					</div>
				{/if}
				{#each channel.tags as tag}
					<div>
						<span class="badge badge-md text-secondary rounded-md font-semibold border-none"
							>{tag}</span>
					</div>
				{/each}
			{/if}
		</div>
	</td>
	<td>
		<div class="flex flex-wrap my-3">
			{#if channel.category && channel.category.length}
				{#each channel.category as category}
					<div class="tooltip" data-tip={category}>
						<img src={$category_list[category]} alt="" class="h-7 w-7 m-1" />
					</div>
				{/each}
			{/if}
		</div>
	</td>
</tr>
