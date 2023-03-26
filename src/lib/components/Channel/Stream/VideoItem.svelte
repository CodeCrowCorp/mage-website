<script lang="ts">
	import IconUser from '$lib/assets/icons/channel/IconUser.svelte'
	import WHIPClient from '$lib/WHIPClient'
	import { onMount } from 'svelte'

	export let video: any
	// const videoElement: any = document.getElementById(video.title)

	// videoElement.addEventListener('dblclick', (event: any) => {
	// 	if (document.fullscreenElement) {
	// 		document.exitFullscreen()
	// 	} else {
	// 		videoElement.requestFullscreen()
	// 	}
	// })
	// videoElement.addEventListener(
	// 	'click',
	// 	(event: { preventDefault: () => void; stopPropagation: () => void }) => {
	// 		event.preventDefault()
	// 		event.stopPropagation()
	// 		videoElement.scrollIntoView()
	// 	}
	// )

	onMount(() => {
		// const input = new WHIPClient(video.webRTC.url, videoElement, 'screen')
	})
</script>

<div class="w-96">
	<div class="bg-gray-200 relative w-full h-full rounded-md">
		<div class="flex items-center justify-center h-full">
			<div class="relative w-14 h-14 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
				<IconUser />
			</div>
			<!-- <video id={video.title} /> -->
		</div>
		<div class="absolute left-2 bottom-1">
			<span class="text-sm">@{video.title}</span>
		</div>
	</div>
</div>
