<script lang="ts">
	import WHEPClient from '$lib/WHEPClient'
	import WHIPClient from '$lib/WHIPClient'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	// import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	// import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	// import { emitChannelUpdate } from '$lib/websocket'
	// import { getColoredRole } from '$lib/utils'
	import { draggable } from '@neodrag/svelte'
	import { is_sharing_audio, is_sharing_screen, is_sharing_webcam } from '$lib/stores/streamStore'

	export let video: any, channel: any, sender: any

	let coloredRole: any = {},
		isGuest = false,
		screenElement: HTMLVideoElement,
		webcamElement: HTMLVideoElement,
		audioElement: HTMLVideoElement,
		screenWhip: WHIPClient,
		screenWhep: WHEPClient,
		webcamWhip: WHIPClient,
		webcamWhep: WHEPClient,
		audioWhip: WHIPClient,
		audioWhep: WHEPClient

	$: if (video.screen || !video.screen) {
		toggleClient({
			trackType: 'screen'
		})
	}

	$: if (video.webcam || !video.webcam) {
		toggleClient({
			trackType: 'webcam'
		})
	}

	$: if (video.audio || !video.audio) {
		toggleClient({
			trackType: 'audio'
		})
	}

	const toggleClient = ({ trackType }: { trackType: string }) => {
		if ($page.data?.user?.userId === video._id) {
			switch (trackType) {
				case 'screen':
					if (video.screen) {
						screenWhip = new WHIPClient(
							video.screen.webRTC.url,
							screenElement,
							video.screen.trackType
						)
						screenWhip.addEventListener(
							`localStreamStopped-${trackType}`,
							() => ($is_sharing_screen = false)
						)
					}
					break
				case 'webcam':
					if (video.webcam) {
						webcamWhip = new WHIPClient(
							video.webcam.webRTC.url,
							webcamElement,
							video.webcam.trackType
						)
						webcamWhip.addEventListener(
							`localStreamStopped-${trackType}`,
							() => ($is_sharing_webcam = false)
						)
					}
					break
				case 'audio':
					if (video.audio) {
						audioWhip = new WHIPClient(video.audio.webRTC.url, audioElement, video.audio.trackType)
						audioWhip.addEventListener(
							`localStreamStopped-${trackType}`,
							() => ($is_sharing_audio = false)
						)
					}
					break
			}
		} else {
			switch (trackType) {
				case 'screen':
					if (video.screen) {
						screenWhep = new WHEPClient(
							video.screen.webRTCPlayback.url,
							screenElement,
							video.screen.trackType
						)
					} else {
						if (screenElement) screenElement.srcObject = null
					}
					break
				case 'webcam':
					if (video.webcam) {
						webcamWhep = new WHEPClient(
							video.webcam.webRTCPlayback.url,
							webcamElement,
							video.webcam.trackType
						)
					} else {
						if (webcamElement) webcamElement.srcObject = null
					}
					break
				case 'audio':
					if (video.audio) {
						audioWhep = new WHEPClient(
							video.audio.webRTCPlayback.url,
							audioElement,
							video.audio.trackType
						)
					} else {
						if (audioElement) audioElement.srcObject = null
					}
					break
			}
		}
	}

	onMount(() => {
		// coloredRole = getColoredRole(sender.role)
		// isGuest = channel?.guests?.includes(sender.userData?.userId)
		screenElement = document.getElementById(`screen-${video._id}`) as HTMLVideoElement
		webcamElement = document.getElementById(`webcam-${video._id}`) as HTMLVideoElement
		audioElement = document.getElementById(`audio-${video._id}`) as HTMLVideoElement

		if (screenElement) {
			screenElement.addEventListener('dblclick', (event: any) => {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					screenElement.requestFullscreen()
				}
			})
		}

		if (webcamElement) {
			webcamElement.addEventListener('dblclick', (event: any) => {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					webcamElement.requestFullscreen()
				}
			})
		}
	})

	is_sharing_screen.subscribe((value) => {
		//prevents duplicate calls from WHIPClient
		if (value === false && screenElement?.srcObject) {
			screenWhip?.disconnectStream()
		}
	})

	is_sharing_webcam.subscribe((value) => {
		if (value === false && webcamElement?.srcObject) {
			webcamWhip?.disconnectStream()
		}
	})

	is_sharing_audio.subscribe((value) => {
		if (value === false && audioElement?.srcObject) {
			audioWhip?.disconnectStream()
		}
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
		{#if !video.screen && !video.webcam}
			<div
				class="w-24 md:w-24 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2 right-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<img src={video.avatar} alt="" />
			</div>
		{/if}
		<video id={`screen-${video._id}`} autoplay muted class="rounded-md" />
		<div use:draggable={{ bounds: 'parent' }} class="absolute bottom-0 right-0 w-1/2 h-fit">
			<video id={`webcam-${video._id}`} autoplay muted class="rounded-md" />
		</div>
		<video id={`audio-${video._id}`} autoplay muted class="rounded-md w-0 h-0" />
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
