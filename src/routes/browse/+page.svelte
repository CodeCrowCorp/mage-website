<script lang="ts">
	import Carousel from '$lib/components/Browse/Carousel.svelte'
	import ChannelSearch from '$lib/components/Browse/ChannelSearch.svelte'
	import ChannelList from '$lib/components/Browse/ChannelTable.svelte'
	import ChannelSection from '$lib/components/Browse/ChannelGroup.svelte'
	import { onMount } from 'svelte'
	import { getChannels } from '$lib/stores/channelStore'

	let channels: any
	onMount(async () => {
		channels = await getChannels()
	})
	$: console.log(channels)
</script>

<Carousel />
<ChannelSearch />

<ChannelSection title="Daily category" bind:channels />
<ChannelSection title="Most active" bind:channels />
<ChannelSection title="Top streamers" bind:channels />

<ChannelList />
