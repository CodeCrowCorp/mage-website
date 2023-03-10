<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	// import IconLock from '$lib/assets/icons/IconLock.svelte'
	// import VirtualList from '@sveltejs/svelte-virtual-list'
	import { goto } from '$app/navigation'
	import LoadingItemTable from '$lib/components/Browse/Sections/LoadingItemTable.svelte'
	import { category_list } from '$lib/stores/channelStore'

	export let channels: any = []
</script>

{#await channels}
	<div class="flex flex-col w-full">
		<LoadingItemTable />
	</div>
{:then value}
	{#if value.length > 0}
		<table class="table-auto w-full">
			<thead>
				<tr>
					<th class="px-4 text-start">Host</th>
					<th class="px-1 text-start">Title</th>
					<th class="px-1 text-start">Viewers</th>
					<th class="px-1 text-start">Tag</th>
					<th class="px-1 text-start">Category</th>
				</tr>
			</thead>
			<tbody>
				{#each value as channel}
					<tr
						class="cursor-pointer hover:btn-ghost border border-transparent"
						on:click|preventDefault={() => goto(`/channel/${channel._id}`)}>
						<!-- <ul class="menu">
								<li> -->
						<td>
							<div class="flex items-center space-x-2 my-3 pl-3">
								<div class="avatar">
									<div class="w-12 mask mask-squircle">
										<img src={channel.avatar} alt="" />
									</div>
								</div>
								<div>
									<div class="font-bold">{channel.createdByDisplayName || ''}</div>
									<div class="text-sm text-pink-500">@{channel.createdByUsername || ''}</div>
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
							<div class="flex gap-2 my-3">
								<!-- {#if channel.isPrivate}
										<IconLock />
									{/if} -->
								<IconViewers />
								<span>{channel.memberCount || '0'}</span>
							</div>
						</td>
						<td>
							<div class="flex flex-wrap gap-2 my-3">
								{#if channel.tags && channel.tags.length}
									{#each channel.tags as tag}
										<div>
											<span
												class="badge badge-md text-primary bg-gray-200 rounded-md font-semibold border-none"
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
						<!-- </li>
							</ul> -->
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th class="px-4 text-start">Host</th>
					<th class="px-1 text-start">Title</th>
					<th class="px-1 text-start">Viewers</th>
					<th class="px-1 text-start">Tag</th>
					<th class="px-1 text-start">Category</th>
				</tr>
			</tfoot>
		</table>
	{/if}
{/await}
