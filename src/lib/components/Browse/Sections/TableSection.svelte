<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import IconLock from '$lib/assets/icons/IconLock.svelte'
	import VirtualList from '@sveltejs/svelte-virtual-list'
	import { techList } from '$lib/stores/channelStore'
	import { goto } from '$app/navigation'
	import LoadingTableItem from '$lib/components/Browse/Sections/LoadingTableItem.svelte'

	export let channels: any = []
</script>

<div class="w-full">
	<table class="table table-auto table-zebra w-full">
		<thead>
			<tr>
				<th>Host</th>
				<th>Title</th>
				<th>Viewers</th>
				<th>Tag</th>
				<th>Category</th>
			</tr>
		</thead>
		<tbody>
			{#if channels && channels.length}
				{#each channels as channel}
					<tr
						class="cursor-pointer"
						on:click|preventDefault={() => goto(`/channel/${channel._id}`)}>
						<td>
							<div class="flex items-center space-x-2">
								<div class="avatar">
									<div class="w-12 rounded-full">
										<img src={channel.avatar} alt="" />
									</div>
								</div>
								<div>
									<div class="font-bold">{channel.createdBy || ''}</div>
									<div class="text-sm text-pink-500">@{channel.user || ''}</div>
								</div>
							</div>
						</td>
						<td>
							{channel.title}
							<br />
							<span class="text-sm">{channel.description}</span>
						</td>
						<td>
							<div class="flex gap-2">
								{#if channel.isPrivate}
									<IconLock />
								{/if}
								<IconViewers />
								<span>{channel.memberCount || '0'}</span>
							</div>
						</td>
						<td>
							<div class="flex flex-wrap gap-2">
								{#if channel.tags && channel.tags.length}
									{#each channel.tags as tag}
										<div><span class="badge badge-primary badge-md">{tag}</span></div>
									{/each}
								{/if}
							</div>
						</td>
						<td>
							<div class="flex flex-wrap">
								{#if channel.category && channel.category.length}
									{#each channel.category as category}
										<div class="tooltip" data-tip={category}>
											<img src={$techList[category]} alt="" class="h-7 w-7 m-1" />
										</div>
									{/each}
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			{:else}
				<!-- <div role="status" class="flex flex-row gap-1 animate-pulse"> -->
				{#each Array(5) as _, index (index)}
					<tr>
						<LoadingTableItem />
					</tr>
				{/each}
				<span class="sr-only">Loading...</span>
				<!-- </div> -->
			{/if}
		</tbody>
		<tfoot>
			<tr>
				<th>Host</th>
				<th>Title</th>
				<th>Viewers</th>
				<th>Tags</th>
				<th>Category</th>
			</tr>
		</tfoot>
	</table>
</div>
