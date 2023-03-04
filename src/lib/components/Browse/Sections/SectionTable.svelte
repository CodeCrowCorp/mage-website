<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import IconLock from '$lib/assets/icons/IconLock.svelte'
	// import VirtualList from '@sveltejs/svelte-virtual-list'
	import { goto } from '$app/navigation'
	import LoadingItemTable from '$lib/components/Browse/Sections/LoadingItemTable.svelte'
	import { onMount } from 'svelte'
	import { getTechListJson, techList } from '$lib/stores/channelStore'

	export let channels: any = []

	onMount(async () => {
		if (!$techList.length) {
			await getTechListJson()
		}
	})
</script>

{#await channels}
	<div class="flex flex-col w-full">
		<LoadingItemTable />
	</div>
{:then value}
	{#if value.length > 0}
		<div class="flex flex-col w-full">
			<table class="w-full">
				<thead>
					<tr>
						<th class="pl-4">Host</th>
						<th>Title</th>
						<th>Viewers</th>
						<th>Tag</th>
						<th>Category</th>
					</tr>
				</thead>
				<tbody>
					{#each value as channel}
						<tr
							class="cursor-pointer"
							on:click|preventDefault={() => goto(`/channel/${channel._id}`)}>
							<td>
								<div class="flex items-center space-x-2 my-3 pl-3">
									<div class="avatar">
										<div class="w-12 mask mask-squircle">
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
								<div class="my-3">
									{channel.title}
									<br />
									<span class="text-sm">{channel.description}</span>
								</div>
							</td>
							<td>
								<div class="flex gap-2 my-3">
									{#if channel.isPrivate}
										<IconLock />
									{/if}
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
													class="badge badge-md text-primary bg-gray-200 rounded-md font-semibold"
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
												<img src={$techList[category]} alt="" class="h-7 w-7 m-1" />
											</div>
										{/each}
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th class="pl-4">Host</th>
						<th>Title</th>
						<th>Viewers</th>
						<th>Tags</th>
						<th>Category</th>
					</tr>
				</tfoot>
			</table>
		</div>
	{/if}
{/await}
