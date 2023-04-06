<script lang="ts">
	// import IconLock from '$lib/assets/icons/IconLock.svelte'
	// import VirtualList from '@sveltejs/svelte-virtual-list'
	import LoadingItemTable from '$lib/components/Browse/Sections/LoadingItemTable.svelte'
	import SectionTableRow from '$lib/components/Browse/Sections/SectionTableRow.svelte'
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import { get } from '$lib/api'

	export let channels: any = []

	let skip = 100
	let limit = 100
	let moreChannels: any[] = []
	async function loadMore(): Promise<void> {
		const infiniteChannels = await get(`channels?skip=${skip}&limit=${limit}`)
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
					<SectionTableRow {channel} />
				{/each}
				{#each moreChannels as channel}
					<SectionTableRow {channel} />
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
