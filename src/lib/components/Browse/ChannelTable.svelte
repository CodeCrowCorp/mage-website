<script lang="ts">
	import IconLock from '$lib/assets/icons/IconLock.svelte'
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import VirtualList from '@sveltejs/svelte-virtual-list'

	export let channels: any = undefined
</script>

<!-- <div class="flex flex-col table-zebra">
	<div class="grid grid-cols-5 uppercase font-semibold text-sm w-full">
		<div class="py-2 px-4">Host</div>
		<div class="py-2 px-4">Title</div>
		<div class="py-2 px-4">Viewers</div>
		<div class="py-2 px-4">Tag</div>
		<div class="py-2 px-4">Category</div>
	</div>

	{#if channels && channels.length}
		<VirtualList height="500px" items={channels} let:item>
			<div class="grid grid-cols-5 w-full first:ml-3">
				<div>
					<div class="flex items-center space-x-3 p-1">
						<div class="avatar">
							<div class="w-12 rounded-full">
								<img src={item.avatar} alt="" />
							</div>
						</div>
						<div>
							<div class="font-bold">{item.createdBy || 'No user'}</div>
							<div class="text-sm text-pink-500">@GaganSuie</div>
						</div>
					</div>
				</div>
				<div class="p-1">
					{item.title}
					<br />
					<span class="text-sm">{item.description}</span>
				</div>
				<div>
					<div class="flex gap-2 p-1">
						<IconLock />
						<IconViewers />
						<span>205</span>
					</div>
				</div>
				<div>
					<div class="flex flex-wrap gap-2 max-w-fit p-1">
						{#if item.tags && item.tags.length}
							{#each item.tags as tag}
								<div><span class="badge badge-primary badge-md">{tag}</span></div>
							{/each}
						{/if}
					</div>
				</div>
				<div>
					<div class="flex p-1">
						<img src="/category/games/call-of-duty-black-ops-4.svg" />
						<img src="/category/games/fortnite.svg" />
						<img src="/category/games/overwatch.svg" />
						<img src="/category/games/valorant.svg" />
					</div>
				</div>
			</div>
		</VirtualList>
	{/if}
</div> -->

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
					<tr class="cursor-pointer">
						<td>
							<div class="flex items-center space-x-2">
								<div class="avatar">
									<div class="w-12 rounded-full">
										<img src={channel.avatar} alt="" />
									</div>
								</div>
								<div>
									<div class="font-bold">{channel.createdBy || ''}</div>
									<div class="text-sm text-pink-500">@GaganSuie</div>
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
								<span>{channel.memberCount || ''}</span>
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
								<img src="/category/games/call-of-duty-black-ops-4.svg" />
								<img src="/category/games/fortnite.svg" />
								<img src="/category/games/overwatch.svg" />
								<img src="/category/games/valorant.svg" />
							</div>
						</td>
					</tr>
				{/each}
			{:else}
				<tr>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
					<td>
						<div
							role="status"
							class="flex w-full h-12 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
							<span class="sr-only">Loading...</span>
						</div>
					</td>
				</tr>
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
