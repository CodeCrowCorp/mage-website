<script lang="ts">
	import Carousel from '$lib/components/Browse/Carousel.svelte'
	import ChannelSearch from '$lib/components/Browse/ChannelSearch.svelte'
	import ChannelList from '$lib/components/Browse/ChannelTable.svelte'
	import { onMount } from 'svelte'
	import { getMyChannels } from '$lib/stores/channelStore'

	onMount(async () => {
		let x = await getMyChannels()
		console.log(x)
	})
</script>

<Carousel />
<ChannelSearch />
<ChannelList />
