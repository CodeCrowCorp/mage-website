<script lang="ts">
	import Carousel from '$lib/components/Browse/Carousel.svelte'
	import ChannelList from '$lib/components/Browse/ChannelList.svelte'
	import { onMount } from 'svelte'
	import ChannelStore from '$lib/stores/channelStore'

	const channelStore = new ChannelStore()

	onMount(async () => {
		let x = await channelStore.getMyChannels()
		console.log(x)
	})
</script>

<Carousel />
<ChannelList />
