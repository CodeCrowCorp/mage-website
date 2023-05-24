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
		audioElement: HTMLAudioElement,
		screenWhip: WHIPClient,
		screenWhep: WHEPClient,
		webcamWhip: WHIPClient,
		webcamWhep: WHEPClient,
		audioWhip: WHIPClient,
		audioWhep: WHEPClient,
		prevScreen: any,
		prevWebcam: any,
		prevAudio: any,
		isMounted: boolean = false,
		isWebcamFocused: boolean = false

	$: if (isMounted && video.screen !== prevScreen) {
		handleScreenChanges()
	}

	$: if (isMounted && video.webcam !== prevWebcam) {
		handleWebcamChanges()
	}

	$: if (isMounted && video.audio !== prevAudio) {
		handleAudioChanges()
	}

	const handleScreenChanges = () => {
		prevScreen = video.screen
		toggleClient({
			trackType: 'screen'
		})
	}
	const handleWebcamChanges = () => {
		prevWebcam = video.webcam
		toggleClient({
			trackType: 'webcam'
		})
	}
	const handleAudioChanges = () => {
		prevAudio = video.audio
		toggleClient({
			trackType: 'audio'
		})
	}

	const toggleClient = ({ trackType }: { trackType: string }) => {
		if ($page.data.user?.userId === video._id) {
			switch (trackType) {
				case 'screen':
					if (video.screen && $is_sharing_screen) {
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
					if (video.webcam && $is_sharing_webcam) {
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
					if (video.audio && $is_sharing_audio) {
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
						screenElement.muted = false
						screenElement.play()
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
						audioElement.muted = false
						audioElement.play()
					} else {
						if (audioElement) audioElement.srcObject = null
					}
					break
			}
		}
	}

	const onMouseDown = () => {
		isWebcamFocused = true
	}

	const onMouseUp = () => {
		isWebcamFocused = false
	}

	// const initializeAndHandleChanges = () => {
	// 	if (!prevScreen) {
	// 		prevScreen = video.screen
	// 		handleScreenChanges()
	// 	}
	// 	if (!prevWebcam) {
	// 		prevWebcam = video.webcam
	// 		handleWebcamChanges()
	// 	}
	// 	if (!prevAudio) {
	// 		prevAudio = video.audio
	// 		handleAudioChanges()
	// 	}
	// }

	onMount(() => {
		// coloredRole = getColoredRole(sender.role)
		// isGuest = channel?.guests?.includes(sender.userData?.userId)
		screenElement = document.getElementById(`screen-${video._id}`) as HTMLVideoElement
		webcamElement = document.getElementById(`webcam-${video._id}`) as HTMLVideoElement
		audioElement = document.getElementById(`audio-${video._id}`) as HTMLAudioElement

		if (screenElement) {
			screenElement.addEventListener('dblclick', (event: any) => {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					screenElement.requestFullscreen()
				}
			})
			handleScreenChanges()
		}

		if (webcamElement) {
			webcamElement.addEventListener('dblclick', (event: any) => {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					webcamElement.requestFullscreen()
				}
			})
			handleWebcamChanges()
		}

		if (webcamElement) {
			handleAudioChanges()
		}
		isMounted = true
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
	

	

	$: animate = isWebcamFocused ? '' : 'transition-all'

</script>

<div class={ $is_sharing_screen || $is_sharing_webcam ? "w-full h-full" : "w-[500px] max-h-80"}>
	<div class="bg-base-200 relative w-full h-full rounded-md">
		<img
			src={video.avatar}
			alt=""
			class="absolute inset-0 w-24 md:w-24 mask mask-squircle object-cover m-auto" />
		<div class="absolute inset-0">
			<video id={`screen-${video._id}`} autoplay muted class="rounded-md w-full h-full" />
			<div use:draggable={{ bounds: 'parent' }} on:mousedown={onMouseDown} on:mouseup={onMouseUp} class={ animate + " absolute " +(!$is_sharing_screen ? "w-full bottom-0 left-0 h-full" : "w-1/4 bottom-0 right-0")}>
				<video id={`webcam-${video._id}`} autoplay muted class="rounded-md h-full w-full" />
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
</div>
