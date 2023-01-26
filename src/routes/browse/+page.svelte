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

<Carousel bind:channels />
<ChannelSearch />

<ChannelSection title="Daily category" bind:channels />
<ChannelSection title="Most active" bind:channels />
<ChannelSection title="Top streamers" bind:channels />
<ChannelSection title="Rising stars" bind:channels />

<ChannelList bind:channels />
