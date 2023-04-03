<script lang="ts">
	import WHEPClient from '$lib/WHEPClient'
	import WHIPClient from '$lib/WHIPClient'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'

	export let video: any

	onMount(() => {
		const videoElement: any = document.getElementById(video.trackName)

		if (videoElement) {
			videoElement.addEventListener('dblclick', (event: any) => {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					videoElement.requestFullscreen()
				}
			})
			videoElement.addEventListener(
				'click',
				(event: { preventDefault: () => void; stopPropagation: () => void }) => {
					event.preventDefault()
					event.stopPropagation()
					videoElement.scrollIntoView()
				}
			)

			if (video.trackName) {
				if ($page.data.user.user.username === video.username) {
					new WHIPClient(video.liveInput.webRTC.url, videoElement, video.trackType)
				} else {
					new WHEPClient(video.liveInput.webRTCPlayback.url, videoElement)
				}
			}
		}
	})
</script>

<div class="w-96">
	<div class="bg-gray-200 relative w-full h-full rounded-md">
		<div class="flex items-center justify-center h-full">
			{#if video.trackName === 'screen' || video.trackName === 'webcam'}
				<video id={video.trackName} />
			{:else}
				<div
					class="w-24 md:w-12 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
					<img src={video.avatar} alt="" />
				</div>
			{/if}
		</div>
		<div class="absolute left-2 bottom-1">
			<span class="text-sm">@{video.username}</span>
		</div>
	</div>
</div>
