<script lang="ts">
	import { get } from '$lib/api'
	import { onMount } from 'svelte'
	import SearchBar from '$lib/components/Browse/SearchBar.svelte'
	import ListSearch from '$lib/components/Search/ListSearch.svelte'
	import { page } from '$app/stores'

	let loadingMoreChannels = false
	let loadChannels = 0
	let query = ''
	let searchList: any[] = []

	onMount(async () => {
		const query = $page.url.searchParams.get('searchQuery')
		searchList = await get(`channels?searchQuery=${query}&skip=${0}&limit=${20}`)
	})

	async function loadMore(): Promise<void> {
		loadingMoreChannels = true
		loadChannels += 20
		const moreChannels = await get(`channels?searchQuery=${query}&skip=${0}&limit=${20}`)
		searchList = [...searchList, ...moreChannels]
		loadingMoreChannels = false
	}
</script>

<SearchBar searchPage={true} searchQuery={query} />

<ListSearch
	channels={searchList}
	{loadingMoreChannels}
	on:loadMore={loadMore}
	isSearchPage={true} />
