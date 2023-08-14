<script lang="ts">
	// import VirtualList from '@sveltejs/svelte-virtual-list'
	import LoadingItemTable from '$lib/components/Browse/Sections/LoadingItemTable.svelte'
	import ItemTable from '$lib/components/Browse/Sections/ItemTable.svelte'
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import { get } from '$lib/api'

	export let channels: any = [],
		profileId: string = ''

	let skip = 100
	let limit = 100
	let moreChannels: any[] = []
	const loadMore = async () => {
		let endpoint = profileId ? `channels/user?userId=${profileId}&` : 'channels?'
		const infiniteChannels = await get(`${endpoint}skip=${skip}&limit=${limit}`)
		if (infiniteChannels?.length) {
			moreChannels = [...moreChannels, ...infiniteChannels]
			skip += limit
		}
	}
</script>

{#await channels}
	<div class="flex flex-col w-full">
		<LoadingItemTable />
	</div>
{:then value}
	{#if value.length > 0}
		<table class="table-auto w-full overflow-hidden">
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
					<ItemTable {channel} />
				{/each}
				{#each moreChannels as channel}
					<ItemTable {channel} />
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th class="px-4 text-start">Host</th>
					<th class="px-1 text-start">Title</th>
					<th class="px-1 text-start">Viewers</th>
					<th class="px-1 text-start">Tag</th>
					<th class="px-1 text-start">Category</th>
					<td use:LastItemInViewport on:loadMore={loadMore} />
				</tr>
			</tfoot>
		</table>
	{/if}
{/await}
