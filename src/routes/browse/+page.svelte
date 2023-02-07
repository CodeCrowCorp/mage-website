<script lang="ts">
	import { onMount } from 'svelte'
	import { getTechListJson, techList, getChannels, searchQuery } from '$lib/stores/channelStore'
	import CarouselSection from '$lib/components/Browse/Sections/CarouselSection.svelte'
	import SearchSection from '$lib/components/Browse/Search/SearchSection.svelte'
	import ChannelSection from '$lib/components/Browse/Sections/ChannelSection.svelte'
	import SearchChannel from '$lib/components/Browse/SearchChannel.svelte'
	import UserSection from '$lib/components/Browse/Sections/UserSection.svelte'
	import TableSection from '$lib/components/Browse/Sections/TableSection.svelte'
	import type { PageData } from './$types'
	import { current_user } from '$lib/stores/authStore'

	export let data: PageData

	let q = ''

	let searchingItems = false
	let loadingSearchItems = false
	let loadingMoreChannels = false
	let searchList: any = []
	let loadChannels = 0

	let weeklyTitle = 'Weekly topics'
	let weeklyChannels: any = []
	if (!data.post.weeklyChannels.error) {
		weeklyTitle = `Wk${data.post.weeklyChannels.weekly.weekNumber} ${data.post.weeklyChannels.weekly.topic}`
		weeklyChannels = data.post.weeklyChannels.channels
	} else {
		weeklyChannels = data.post.weeklyChannels.error
	}

	if (data.query) {
		$searchQuery = data.query
		searchingItems = true
	}

	onMount(async () => {
		if (!$techList.length) {
			await getTechListJson()
		}
	})

	async function search() {
		loadingSearchItems = true
		searchList = await getChannels({ skip: 0, limit: 20 })
		loadingSearchItems = false
	}
	async function loadMore() {
		loadingMoreChannels = true
		loadChannels += 20
		let moreChannels = await getChannels({ skip: 0 + loadChannels, limit: 20 })
		searchList = [...searchList, ...moreChannels]
		loadingMoreChannels = false
	}
</script>

{#if !searchingItems}
	<CarouselSection bind:channels={data.post.mostActiveChannels} />
{/if}
<SearchChannel bind:searchingItems bind:q on:search={search} />

{#if searchingItems}
	<SearchSection
		channels={searchList}
		on:load_more={loadMore}
		{loadingSearchItems}
		{loadingMoreChannels} />
{:else}
	<ChannelSection title={weeklyTitle} bind:channels={weeklyChannels} />

	<UserSection title="Highest ranked" bind:users={data.post.highestRankedUsers} />

	<UserSection title="Rising stars" bind:users={data.post.risingStarUsers} />

	{#if current_user}
		<ChannelSection title="My channels" bind:channels={data.post.myChannels} />

		<ChannelSection title="Fav channels" bind:channels={data.post.favChannels} />
	{/if}

	<TableSection bind:channels={data.post.tableChannels} />
{/if}
