<script lang="ts">
	import Carousel from '$lib/components/Browse/Carousel.svelte'
	import ChannelSearch from '$lib/components/Browse/ChannelSearch.svelte'
	import ChannelList from '$lib/components/Browse/ChannelTable.svelte'
	import ChannelSection from '$lib/components/Browse/ChannelGroup.svelte'
	import { onMount } from 'svelte'
	import { getMyChannels } from '$lib/stores/channelStore'

	onMount(async () => {
		let x = await getMyChannels()
		console.log(x)
	})
</script>

<Carousel />
<ChannelSearch />
<ChannelSection title="Daily category" />
<ChannelSection title="Most active" />
<ChannelSection title="Top streamers" />

<ChannelList />
