<script lang="ts">
	import { onMount } from 'svelte'
	import { getTechListJson, techList } from '$lib/stores/channelStore'
	import CarouselSection from '$lib/components/Browse/Sections/CarouselSection.svelte'
	import ChannelSection from '$lib/components/Browse/Sections/ChannelSection.svelte'
	import SearchChannel from '$lib/components/Browse/SearchChannel.svelte'
	import UserSection from '$lib/components/Browse/Sections/UserSection.svelte'
	import TableSection from '$lib/components/Browse/Sections/TableSection.svelte'
	import type { PageData } from './$types'
	import { current_user } from '$lib/stores/authStore'

	export let data: PageData

	let weeklyTitle = 'Weekly topics'
	let weeklyChannels: any = []
	if (!data.post.weeklyChannels.error) {
		// weeklyTitle = `Wk${data.post.weeklyChannels.weekly.weekNumber} ${data.post.weeklyChannels.weekly.topic}`
		weeklyTitle = 'Week'
		weeklyChannels = data.post.weeklyChannels.channels
		console.log(weeklyChannels)
	} else {
		weeklyChannels = data.post.weeklyChannels.error
	}

	onMount(async () => {
		if (!$techList.length) {
			await getTechListJson()
		}
	})
</script>

<CarouselSection channels={data.post.tableChannels} />
<SearchChannel />

<ChannelSection title={weeklyTitle} bind:channels={weeklyChannels} />

<UserSection title="Highest ranked" bind:users={data.post.highestRankedUsers} />

<UserSection title="Rising stars" bind:users={data.post.risingStarUsers} />

{#if current_user}
	<ChannelSection title="My channels" bind:channels={data.post.myChannels} />

	<ChannelSection title="Fav channels" bind:channels={data.post.favChannels} />
{/if}

<TableSection bind:channels={data.post.tableChannels} />
