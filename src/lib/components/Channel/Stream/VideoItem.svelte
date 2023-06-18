<script lang="ts">
	import WHEPClient from '$lib/WHEPClient'
	import WHIPClient from '$lib/WHIPClient'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	import { draggable } from '@neodrag/svelte'
	import { is_sharing_audio, is_sharing_screen, is_sharing_webcam } from '$lib/stores/streamStore'
	import { emitChannelUpdate } from '$lib/websocket'
	import { getColoredRole, setRole } from '$lib/utils'
	import IconChatBan from '$lib/assets/icons/chat/IconChatBan.svelte'

	export let video: any, channel: any

	let role = '',
		coloredRole: any = {},
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
		isWebcamFocused: boolean = false,
		speakingValue: number = 0

	$: isScreenLive = false
	$: isWebcamLive = false

	$: if (channel) {
		role = setRole({ userId: video._id, channel, currentUserId: $page.data.user?.userId })
		coloredRole = getColoredRole(role)
	}

	$: showBanItem =
		(channel.user === $page.data.user?.userId ||
			channel?.mods?.includes($page.data.user?.userId)) &&
		video._id !== $page.data.user?.userId &&
		role !== '🤖 AI'

	$: showRoleItem =
		channel.user === $page.data.user?.userId &&
		video._id !== $page.data.user?.userId &&
		role !== '🤖 AI'

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
						screenWhip.addEventListener(`localStreamStopped-${trackType}`, () => {
							$is_sharing_screen = false
							isScreenLive = false
						})
						screenWhip.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
					}
					break
				case 'webcam':
					if (video.webcam && $is_sharing_webcam) {
						webcamWhip = new WHIPClient(
							video.webcam.webRTC.url,
							webcamElement,
							video.webcam.trackType
						)
						webcamWhip.addEventListener(`localStreamStopped-${trackType}`, () => {
							$is_sharing_webcam = false
							isWebcamLive = false
						})
						webcamWhip.addEventListener(`isWebcamLive`, (ev: any) => (isWebcamLive = ev.detail))
					}
					break
				case 'audio':
					if (video.audio && $is_sharing_audio) {
						audioWhip = new WHIPClient(video.audio.webRTC.url, audioElement, video.audio.trackType)
						audioWhip.addEventListener(`localStreamStopped-${trackType}`, () => {
							$is_sharing_audio = false
							audioWhip.removeEventListener(`localAudioSpeakingValue`, () => {})
						})
						audioWhip.addEventListener(`localAudioSpeakingValue`, (ev: any) => {
							speakingValue = ev.detail
						})
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
						screenWhep.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
					} else {
						if (screenElement) screenElement.srcObject = null
						isScreenLive = false
					}
					break
				case 'webcam':
					if (video.webcam) {
						webcamWhep = new WHEPClient(
							video.webcam.webRTCPlayback.url,
							webcamElement,
							video.webcam.trackType
						)
						webcamWhep.addEventListener(`isWebcamLive`, (ev: any) => (isWebcamLive = ev.detail))
					} else {
						if (webcamElement) webcamElement.srcObject = null
						isWebcamLive = false
					}
					break
				case 'audio':
					if (video.audio) {
						audioWhep = new WHEPClient(
							video.audio.webRTCPlayback.url,
							audioElement,
							video.audio.trackType
						)
						audioWhep.addEventListener(`localAudioSpeakingValue`, (ev: any) => {
							speakingValue = ev.detail
						})
						audioElement.muted = false
						audioElement.play()
					} else {
						if (audioElement) audioElement.srcObject = null
						audioWhep?.removeEventListener(`localAudioSpeakingValue`, () => {})
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

	onMount(() => {
		isGuest = channel?.guests?.includes(video._id)
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

		if (audioElement) {
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

	const toggleBan = () => {
		let isEnabled = false
		if (!channel.bans.includes(video._id)) {
			channel.bans.push(video._id)
			channel.guests = channel.guests.filter((guest: string) => guest !== video._id)
			channel.mods = channel.mods.filter((mod: string) => mod !== video._id)
			isGuest = false
			isEnabled = true
		} else {
			channel.bans = channel.bans.filter((ban: string) => ban !== video._id)
		}
		emitChannelUpdate({
			channelSocket: channel.socket,
			channel,
			roleUpdate: { roleEvent: 'ban', isEnabled, userId: video._id }
		})
	}

	const toggleMod = () => {
		let isEnabled = false
		if (!channel.mods.includes(video._id)) {
			channel.mods.push(video._id)
			isEnabled = true
		} else {
			channel.mods = channel.mods?.filter((mod: string) => mod !== video._id)
		}
		emitChannelUpdate({
			channelSocket: channel.socket,
			channel,
			roleUpdate: { roleEvent: 'mod', isEnabled, userId: video._id }
		})
	}

	const toggleGuest = () => {
		let isEnabled = false
		if (!channel.guests.includes(video._id) && channel.guests.length < 9) {
			channel.guests.push(video._id)
			isEnabled = true
		} else {
			channel.guests = channel.guests.filter((guest: string) => guest !== video._id)
		}
		emitChannelUpdate({
			channelSocket: channel.socket,
			channel,
			roleUpdate: { roleEvent: 'guest', isEnabled, userId: video._id }
		})
	}

	$: animate = isWebcamFocused ? '' : 'transition-all'
</script>

<div class={isScreenLive || isWebcamLive ? 'w-full h-full' : 'w-[500px] max-h-80'}>
	<div class="bg-base-200 relative w-full h-full rounded-md">
		<img
			src={video.avatar}
			alt=""
			class="absolute inset-0 w-24 md:w-24 mask mask-squircle object-cover m-auto" />
		<div class="absolute inset-0">
			<video id={`screen-${video._id}`} autoplay muted class="rounded-md w-full h-full" />
			<div
				use:draggable={{ bounds: 'parent' }}
				on:mousedown={onMouseDown}
				on:mouseup={onMouseUp}
				class={animate +
					' absolute ' +
					(!isScreenLive ? 'w-full bottom-0 left-0 h-full' : 'w-1/4 bottom-0 right-0')}>
				<video id={`webcam-${video._id}`} autoplay muted class="rounded-md h-full w-full" />
			</div>
			<video id={`audio-${video._id}`} autoplay muted class="rounded-md w-0 h-0" />
			<div class="absolute left-2 bottom-2 rounded-md dropdown">
				<label
					tabindex="0"
					class="{coloredRole.textColor} bg-base-100 btn btn-sm normal-case {speakingValue > 10
						? 'btn-outline'
						: 'border-transparent'}">@{video.username}</label>
				{#if showBanItem || showRoleItem}
					<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
						{#if showRoleItem && !channel.bans.includes(video._id)}
							<li>
								<a on:click={() => toggleMod()}
									><IconChatMod /> {role === 'Mod' ? 'Revoke Mod' : 'Grant Mod'}
								</a>
							</li>
							<li>
								<a on:click={() => toggleGuest()}><IconChatGuest /> Revoke Guest </a>
							</li>
						{/if}
						{#if showBanItem}
							<li>
								<a on:click={() => toggleBan()}
									><IconChatBan /> {channel.bans?.includes(video._id) ? 'Unban' : 'Ban'}
								</a>
							</li>
						{/if}
					</ul>
				{/if}
			</div>
		</div>
	</div>
</div>
