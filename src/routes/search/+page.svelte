<script lang="ts">
	import { get } from '$lib/api'
	import { onMount } from 'svelte'
	import SearchChannel from '$lib/components/Browse/SearchChannel.svelte'
	import SearchSection from '$lib/components/Search/SearchSection.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	let loadingMoreChannels = false
	let loadChannels = 0

	onMount(async () => {})

	async function loadMore(): Promise<void> {
		loadingMoreChannels = true
		loadChannels += 20
		const moreChannels = await get(`channels?searchQuery=${data.query}&skip=${0}&limit=${20}`)
		data.post.searchList = [...data.post.searchList, ...moreChannels]
		loadingMoreChannels = false
	}
</script>

<SearchChannel searchPage={true} q={data.query} />

<SearchSection channels={data.post.searchList} {loadingMoreChannels} on:loadMore={loadMore} />
