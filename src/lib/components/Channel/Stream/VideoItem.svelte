<script lang="ts">
	import WHEPClient from '$lib/WHEPClient'
	import WHIPClient from '$lib/WHIPClient'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	// import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	// import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	// import { emitChannelUpdate } from '$lib/websocket'
	// import { getColoredRole } from '$lib/utils'

	export let video: any, channel: any, sender: any

	let coloredRole: any = {},
		isGuest = false,
		screenElement: any,
		webcamElement: any,
		audioElement: any,
		screenWhip: WHIPClient,
		screenWhep: WHEPClient,
		webcamWhip: WHIPClient,
		webcamWhep: WHEPClient,
		audioWhip: WHIPClient,
		audioWhep: WHEPClient

	$: if (video.screen) {
		initClient({
			videoWhip: screenWhip,
			videoWhep: screenWhep,
			videoElement: screenElement,
			videoItem: video.screen
		})
	}

	$: if (video.webcam) {
		initClient({
			videoWhip: webcamWhip,
			videoWhep: webcamWhep,
			videoElement: webcamElement,
			videoItem: video.webcam
		})
	}

	$: if (video.audio) {
		initClient({
			videoWhip: audioWhip,
			videoWhep: audioWhep,
			videoElement: audioElement,
			videoItem: video.audio
		})
	}

	const initVideoElement = ({
		trackType,
		videoElement
	}: {
		trackType: string
		videoElement: any
	}) => {
		videoElement = document.getElementById(`${trackType}-${video._id}`)
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
		}
	}

	const initClient = ({
		videoWhip,
		videoWhep,
		videoElement,
		videoItem
	}: {
		videoWhip: WHIPClient
		videoWhep: WHEPClient
		videoElement: any
		videoItem: any
	}) => {
		if ($page.data.user.user.username === video.username) {
			console.log(videoItem)
			videoWhip = new WHIPClient(videoItem.webRTC.url, videoElement, videoItem.trackType)
		} else if ($page.data.user.user.username !== video.username) {
			videoWhep = new WHEPClient(videoItem.webRTCPlayback.url, videoElement)
		}
	}

	onMount(() => {
		// coloredRole = getColoredRole(sender.role)
		// isGuest = channel?.guests?.includes(sender.userData?.userId)
		initVideoElement({ trackType: 'screen', videoElement: screenElement })
		initVideoElement({ trackType: 'webcam', videoElement: webcamElement })
		initVideoElement({ trackType: 'audio', videoElement: audioElement })
	})

	// const toggleMod = () => {
	// 	if (channel.mods.includes(sender.userData?.userId)) {
	// 		channel.mods = channel.mods.filter((mod: string) => mod !== sender.userData?.userId)
	// 	} else {
	// 		channel.mods.push(sender.userData?.userId)
	// 	}
	// 	emitChannelUpdate({ channel })
	// }

	// const toggleGuest = () => {
	// 	if (channel.guests.includes(sender.userData?.userId)) {
	// 		channel.guests = channel.guests.filter((guest: string) => guest !== sender.userData?.userId)
	// 	} else {
	// 		channel.guests.push(sender.userData?.userId)
	// 	}
	// 	emitChannelUpdate({ channel })
	// }
</script>

<div class="w-[500px]">
	<div class="bg-base-200 relative w-full h-full rounded-md">
		<div class="flex items-center justify-center h-full">
			<div
				class="w-24 md:w-24 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
				<img src={video.avatar} alt="" />
			</div>
			{#if video.screen}
				<video id={`screen-${video._id}`} />
			{/if}
			{#if video.webcam}
				<video id={`webcam-${video._id}`} />
			{/if}
			{#if video.audio}
				<video id={`audio-${video._id}`} />
			{/if}
		</div>
		<div class="absolute left-2 bottom-2 rounded-md dropdown">
			<label tabindex="0" class="btn btn-sm normal-case">@{video.username}</label>
			<!-- <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
				<li>
					<a on:click={() => toggleMod()}
						><IconChatMod /> {sender?.role === 'Mod' ? 'Remove Mod' : 'Grant Mod'}
					</a>
				</li>
				<li>
					<a on:click={() => toggleGuest()}><IconChatGuest /> Revoke Guest </a>
				</li>
			</ul> -->
		</div>
	</div>
</div>
