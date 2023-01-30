<script lang="ts">
	import Carousel from '$lib/components/Browse/Carousel.svelte'
	import ChannelSearch from '$lib/components/Browse/ChannelSearch.svelte'
	import ChannelList from '$lib/components/Browse/ChannelTable.svelte'
	import ChannelSection from '$lib/components/Browse/Section.svelte'
	import { onMount } from 'svelte'
	import { getChannels, getTechListJson, techList } from '$lib/stores/channelStore'

	let channels: any
	onMount(async () => {
		if (!$techList.length) {
			await getTechListJson()
		}
		channels = await getChannels()
	})
</script>

<Carousel bind:channels /> <!-- Most active -->
<ChannelSearch />

<ChannelSection title="Wk1: Favorite game of all time" bind:channels />
<ChannelSection title="Highest Ranked" bind:channels /> <!-- UserSection -->
<ChannelSection title="Rising stars" bind:channels /> <!-- UserSection -->
<ChannelSection title="My channels" bind:channels />
<ChannelSection title="Fav channels" bind:channels />

<ChannelList bind:channels />
