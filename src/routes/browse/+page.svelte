<script lang="ts">
	import Carousel from '$lib/components/Browse/Carousel.svelte'
	import ChannelSearch from '$lib/components/Browse/ChannelSearch.svelte'
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
		techList
	} from '$lib/stores/channelStore'
	import { getHighestRankedUsers } from '$lib/stores/userStore'
	import { currentUser } from '$lib/stores/authStore'

	let mostActiveChannels: any
	let weeklyChannels: any
	let highestRankedUsers: any
	let myChannels: any
	let favChannels: any
	let channels: any
	onMount(async () => {
		if (!$techList.length) {
			await getTechListJson()
		}
		mostActiveChannels = await getMostActiveChannels({ skip: 0, limit: 10 })
		weeklyChannels = await getWeeklyChannels({ skip: 0, limit: 10 })
		highestRankedUsers = await getHighestRankedUsers({ skip: 0, limit: 10 })
		myChannels = await getMyChannels({ skip: 0, limit: 10 })
		favChannels = await getFavChannels({ skip: 0, limit: 10 })
		channels = await getChannels({ skip: 0, limit: 50 })
	})
</script>

{#if mostActiveChannels && mostActiveChannels.length > 0}
	<Carousel bind:channels={mostActiveChannels} />
{/if}

<ChannelSearch />

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
