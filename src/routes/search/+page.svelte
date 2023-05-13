<script lang="ts">
	import { get } from '$lib/api'
	import { onMount } from 'svelte'
	import SearchBar from '$lib/components/Browse/SearchBar.svelte'
	import ListSearch from '$lib/components/Search/ListSearch.svelte'
	import { page } from '$app/stores'
	import { getSectionUrl } from '$lib/utils'

	let loadingMoreChannels = false
	let query = ''
	let searchList: any[] = []
	let skip: number = 0
	let limit: number = 20
	let sectionId = ''
	let title = ''

	onMount(async () => {
		sectionId = $page.params.sectionId
		const url = getSectionUrl({ sectionId, query, skip, limit })
		searchList = await get(url)
	})

	async function loadMore(): Promise<void> {
		loadingMoreChannels = true
		const url = getSectionUrl({ sectionId, query, skip, limit })
		const moreChannels = await get(url, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		searchList = [...searchList, ...moreChannels]
		skip += limit
		loadingMoreChannels = false
	}
</script>

<SearchBar searchPage={true} searchQuery={query} />

<div class="font-semibold m-3">
	<a class="link link-secondary text-lg">{title}</a>
</div>

<ListSearch channels={searchList} on:loadMore={loadMore} />
