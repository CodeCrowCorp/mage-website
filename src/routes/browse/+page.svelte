<script lang="ts">
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import Carousel from '$lib/components/Browse/Carousel.svelte'
	import ChannelSearch from '$lib/components/Browse/ChannelSearch.svelte'
	import SearchSection from '$lib/components/Browse/SearchSection.svelte'
	import ChannelTable from '$lib/components/Browse/ChannelTable.svelte'
	import ChannelSection from '$lib/components/Browse/ChannelSection.svelte'
	import UseSection from '$lib/components/Browse/UserSection.svelte'
	import { onMount } from 'svelte'
	import {
		getMostActiveChannels,
		getWeeklyChannels,
		getMyChannels,
		getFavChannels,
		getChannels,
		getTechListJson,
		techList,
		searchingChannel,
		loadMoreChannel
	} from '$lib/stores/channelStore'
	import { getHighestRankedUsers } from '$lib/stores/userStore'
	import { currentUser } from '$lib/stores/authStore'

	export let data

	$: {
		if (data.search_channels) {
			search_channels = data.search_channels
		}
	}

	let mostActiveChannels: any
	let weeklyChannels: any
	let highestRankedUsers: any
	let myChannels: any
	let favChannels: any
	let channels: any = []
	let search_channels: any = []
	let load = 0
	onMount(async () => {
		if (!$techList.length) {
			await getTechListJson()
		}
		mostActiveChannels = [] // await getMostActiveChannels({ skip: 0, limit: 10 })
		weeklyChannels = [] // await getWeeklyChannels({ skip: 0, limit: 10 })
		highestRankedUsers = [] // await getHighestRankedUsers({ skip: 0, limit: 10 })
		myChannels = [] // await getMyChannels({ skip: 0, limit: 10 })
		favChannels = [] // await getFavChannels({ skip: 0, limit: 10 })
		channels = await getChannels({ skip: 0, limit: 100 })
	})

	async function search() {
		$searchingChannel = true
		search_channels = await getChannels({ skip: 0, limit: 20 })
		$searchingChannel = false
	}
	async function loadMore() {
		$loadMoreChannel = true
		load += 20
		let new_channels = await getChannels({ skip: 0 + load, limit: 20 })
		search_channels = [...search_channels, ...new_channels]
		$loadMoreChannel = false
	}
</script>

{#if mostActiveChannels && mostActiveChannels.length > 0}
	<Carousel bind:channels={mostActiveChannels} />
{/if}

<ChannelSearch on:search={search} />

{#if search_channels.length || $searchingChannel}
	<SearchSection channels={search_channels} on:load_more={loadMore} />
{:else}
	{#if weeklyChannels && weeklyChannels.length > 0}
		<ChannelSection
			title="Wk${weeklyChannels.weekly.weekNumber} ${weeklyChannels.weekly.topic}"
			bind:channels={weeklyChannels.channels} />
	{/if}

	{#if highestRankedUsers && highestRankedUsers.length > 0}
		<UseSection title="Highest ranked" bind:users={highestRankedUsers} />
	{/if}

	<!-- <UseSection title="Rising stars" bind:channels /> -->

	{#if $currentUser && myChannels && myChannels.length > 0}
		<ChannelSection title="My channels" bind:channels={myChannels} />
	{/if}

	{#if $currentUser && favChannels && favChannels.length > 0}
		<ChannelSection title="Fav channels" bind:channels={favChannels} />
	{/if}

	{#if channels && channels.length > 0}
		<ChannelTable bind:channels />
	{/if}
{/if}
