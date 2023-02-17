<script lang="ts">
	import { get } from '$lib/api'
	import { onMount } from 'svelte'
	import SearchBar from '$lib/components/Browse/SearchBar.svelte'
	import ListSearch from '$lib/components/Search/ListSearch.svelte'
	import { page } from '$app/stores'
	import { getSectionUrl } from '$lib/utils'
	import type { PageData } from '../$types'

	export let title: string = '',
		data: PageData

	$: ({ user } = data)
	let loadingMoreChannels = false
	let query = ''
	let searchList: any[] = []
	let skip: number = 0
	let limit: number = 20
	let sectionId = ''

	onMount(async () => {
		sectionId = $page.params.sectionId
		const url = getSectionUrl({ sectionId, query, skip, limit })
		searchList = await get(url)
	})

	async function loadMore(): Promise<void> {
		loadingMoreChannels = true
		skip += limit
		const url = getSectionUrl({ sectionId, query, skip, limit })
		const moreChannels = await get(url, { userId: user?.userId, token: user?.token })
		searchList = [...searchList, ...moreChannels]
		loadingMoreChannels = false
	}
</script>

<SearchBar searchPage={true} searchQuery={query} />

<div class="font-semibold m-3">
	<a class="link link-secondary text-lg">{title}</a>
</div>

<ListSearch
	channels={searchList}
	{loadingMoreChannels}
	on:loadMore={loadMore}
	isSearchPage={false} />
