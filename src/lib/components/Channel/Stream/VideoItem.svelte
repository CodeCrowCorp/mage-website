<script lang="ts">
	import WHEPClient from '$lib/WHEPClient'
	import WHIPClient from '$lib/WHIPClient'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	import { draggable } from '@neodrag/svelte'
	import {
		is_sharing_rtmps,
		is_sharing_screen,
		is_sharing_webcam,
		is_sharing_audio
	} from '$lib/stores/streamStore'
	import { emitChannelUpdate } from '$lib/websocket'
	import { captureScreenShot, dataURLtoFile, formatTime, getColoredRole, setRole } from '$lib/utils'
	import IconChatBan from '$lib/assets/icons/chat/IconChatBan.svelte'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { get, putImage } from '$lib/api'
	import IconListen from '$lib/assets/icons/channel/IconListen.svelte'

	export let video: any, channel: any

	let role = '',
		coloredRole: any = {},
		screen_element: HTMLVideoElement,
		webcam_element: HTMLVideoElement,
		audio_element: HTMLAudioElement,
		screenWhip: WHIPClient,
		screenWhep: WHEPClient,
		webcamWhip: WHIPClient,
		webcamWhep: WHEPClient,
		audioWhip: WHIPClient,
		audioWhep: WHEPClient,
		isConnectedRtmps: any,
		isConnectedScreen: any,
		isConnectedWebcam: any,
		isConnectedAudio: any,
		isMounted: boolean = false,
		isWebcamFocused: boolean = false,
		speakingValue: number = 0,
		streamTime: number = 0,
		timerInterval: any,
		formattedTime: string = '00:00:00',
		isHoverVideo: boolean = false,
		iframeUrl: string = '',
		isListenBtnShown: boolean = true,
		imgElement: HTMLImageElement

	// WHIP/WHEP variables that determine if stream is coming in
	$: isScreenLive = false

	$: if (channel) {
		role = setRole({ userId: video._id, channel, currentUserId: $page.data.user?.userId })
		coloredRole = getColoredRole(role)
	}

	$: showBanItem =
		(channel.userId === $page.data.user?.userId ||
			channel?.mods?.includes($page.data.user?.userId)) &&
		channel.userId !== video._id &&
		video._id !== $page.data.user?.userId &&
		role !== '🤖 AI'

	$: showRoleItem =
		channel.userId === $page.data.user?.userId &&
		video._id !== $page.data.user?.userId &&
		role !== '🤖 AI'

	$: if (isMounted && video.rtmps?.isConnected !== isConnectedRtmps) {
		handleRtmpsChanges()
	}

	$: if (isMounted && video.screen?.isConnected !== isConnectedScreen) {
		handleScreenChanges()
	}

	$: if (isMounted && video.webcam?.isConnected !== isConnectedWebcam) {
		handleWebcamChanges()
	}

	$: if (isMounted && video.audio?.isConnected !== isConnectedAudio) {
		handleAudioChanges()
	}

	$: if (video.rtmps?.isConnected || video.screen?.isConnected) {
		toggleTimer(true)
	} else {
		toggleTimer(false)
	}

	$: animate = isWebcamFocused ? '' : 'transition-all'

	const handleRtmpsChanges = () => {
		isConnectedRtmps = video.rtmps?.isConnected
		toggleClient({
			trackType: 'rtmps'
		})
	}
	const handleScreenChanges = () => {
		isConnectedScreen = video.screen?.isConnected
		toggleClient({
			trackType: 'screen'
		})
	}
	const handleWebcamChanges = () => {
		isConnectedWebcam = video.webcam?.isConnected
		toggleClient({
			trackType: 'webcam'
		})
	}
	const handleAudioChanges = () => {
		isConnectedAudio = video.audio?.isConnected
		toggleClient({
			trackType: 'audio'
		})
	}

	onMount(() => {
		try {
			handleRtmpsChanges()
			handleScreenChanges()
			handleWebcamChanges()
			handleAudioChanges()
			if (video._id === $page.data.user?.userId) {
				is_sharing_screen.subscribe(async (value: any) => {
					if (value === true) {
						screenWhip = getWhip({
							whip: screenWhip,
							url: video.screen?.webRTC.url,
							videoElement: screen_element,
							trackType: `screen`
						})
						screenWhip.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
						if (screen_element) {
							screen_element.addEventListener('dblclick', (event: any) => {
								if (document.fullscreenElement) {
									document.exitFullscreen()
								} else {
									screen_element.requestFullscreen()
								}
							})
							screenWhip.addEventListener(`localStreamStopped-screen`, () => {
								$is_sharing_screen = undefined
							})
						}
					} else {
						if (value === false) screenWhip?.disconnectStream()
						if (screen_element) screen_element.srcObject = null
						isScreenLive = false
					}
				})

				is_sharing_webcam.subscribe(async (value: any) => {
					if (value === true) {
						webcamWhip = getWhip({
							whip: webcamWhip,
							url: video.webcam?.webRTC.url,
							videoElement: webcam_element,
							trackType: `webcam`
						})
						if (webcam_element) {
							webcam_element.addEventListener('dblclick', (event: any) => {
								if (document.fullscreenElement) {
									document.exitFullscreen()
								} else {
									webcam_element.requestFullscreen()
								}
							})
							webcamWhip.addEventListener(`localStreamStopped-webcam`, () => {
								$is_sharing_webcam = undefined
							})
						}
					} else {
						if (value === false) webcamWhip?.disconnectStream()
						if (webcam_element) webcam_element.srcObject = null
					}
				})

				is_sharing_audio.subscribe(async (value: any) => {
					if (value === true) {
						audioWhip = getWhip({
							whip: audioWhip,
							url: video.audio?.webRTC.url,
							videoElement: audio_element,
							trackType: `audio`
						})
						audioWhip.addEventListener(`localStreamStopped-audio`, () => {
							audioWhip.removeEventListener(`localAudioSpeakingValue`, () => {})
							$is_sharing_audio = undefined
						})
						audioWhip.addEventListener(`localAudioSpeakingValue`, (ev: any) => {
							speakingValue = ev.detail
						})
					} else {
						if (value === false) audioWhip?.disconnectStream()
						if (audio_element) audio_element.srcObject = null
					}
				})
			}
			isMounted = true
		} catch (err) {
			console.error(err)
		}
	})

	const toggleClient = async ({ trackType }: { trackType: string }) => {
		if ($page.data.user?.userId === video._id) {
			switch (trackType) {
				case 'rtmps':
					if (video.rtmps?.isConnected) {
						iframeUrl = video.rtmps?.playback?.iframe
						$is_sharing_rtmps = true
					} else {
						iframeUrl = ''
						$is_sharing_rtmps = false
					}
					break
			}
		} else {
			switch (trackType) {
				case 'rtmps':
					if (video.rtmps?.isConnected) {
						iframeUrl = video.rtmps?.playback?.iframe
					} else {
						iframeUrl = ''
					}
					break
				case 'screen':
					if (video.screen?.isConnected) {
						screenWhep = new WHEPClient(video.screen?.webRTCPlayback.url, screen_element, `screen`)
						screenWhep.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
						if (screen_element) {
							screen_element.addEventListener('dblclick', (event: any) => {
								if (document.fullscreenElement) {
									document.exitFullscreen()
								} else {
									screen_element.requestFullscreen()
								}
							})
						}
					} else {
						if (screen_element) screen_element.srcObject = null
						isScreenLive = false
					}
					break
				case 'webcam':
					if (video.webcam?.isConnected) {
						webcamWhep = new WHEPClient(video.webcam?.webRTCPlayback.url, webcam_element, `webcam`)
						if (webcam_element) {
							webcam_element.addEventListener('dblclick', (event: any) => {
								if (document.fullscreenElement) {
									document.exitFullscreen()
								} else {
									webcam_element.requestFullscreen()
								}
							})
						}
					} else {
						if (webcam_element) webcam_element.srcObject = null
					}
					break
				case 'audio':
					if (video.audio?.isConnected) {
						audioWhep = new WHEPClient(video.audio?.webRTCPlayback.url, audio_element, `audio`)
						audioWhep.addEventListener(`localAudioSpeakingValue`, (ev: any) => {
							speakingValue = ev.detail
						})
					} else {
						if (audio_element) audio_element.srcObject = null
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

	const getWhip = ({
		whip,
		url,
		videoElement,
		trackType
	}: {
		whip: WHIPClient
		url: string
		videoElement: HTMLVideoElement | HTMLAudioElement
		trackType: string
	}) => {
		if (!whip || whip.peerConnection?.connectionState === 'closed') {
			whip = new WHIPClient(url, videoElement, trackType)
		}
		return whip
	}

	const toggleBan = () => {
		let isEnabled = false
		if (!channel.bans.includes(video._id)) {
			channel.bans.push(video._id)
			channel.guests = channel.guests.filter((guest: string) => guest !== video._id)
			channel.mods = channel.mods.filter((mod: string) => mod !== video._id)
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

	const toggleTimer = (isTimerEnabled: boolean) => {
		if (!isTimerEnabled) {
			clearInterval(timerInterval)
			timerInterval = null
			streamTime = 0
			formattedTime = '00:00:00'
		} else {
			if (timerInterval) return
			timerInterval = setInterval(async () => {
				try {
					if (streamTime < 1) {
						const inputId = video.rtmps?.uid || video.screen?.uid
						const streamRecord = await get(`analytics/stream?inputId=${inputId}`)
						streamTime = streamRecord
							? Math.floor((Date.now() - new Date(streamRecord.start + 'Z').getTime()) / 1000)
							: 0
					}
					streamTime += 1
					formattedTime = formatTime(streamTime)
					if (
						!channel.thumbnail &&
						video._id === channel.userId &&
						video._id === $page.data.user?.userId &&
						streamTime === 60
					) {
						const imageSrc = captureScreenShot(channel)
						const file = dataURLtoFile(imageSrc, 'thumbnail-image')
						if (file !== null && file.size > 0 && file.type !== '') {
							await putImage(
								`channel/thumbnail?channelId=${channel._id}&bucketName=thumbnails`,
								file,
								{
									userId: $page.data.user?.userId,
									token: $page.data.user?.token
								}
							)
							channel.thumbnail = imageSrc
						}
					}
				} catch (err) {
					console.log('err', err)
				}
			}, 1000)
		}
	}

	const unmuteTracks = async () => {
		if (screen_element && video.screen?.isConnected) {
			screen_element.play()
			screen_element.muted = video._id === $page.data.user?.userId
			isListenBtnShown = false
		}
		if (audio_element && video.audio?.isConnected) {
			audio_element.play()
			audio_element.muted = video._id === $page.data.user?.userId
			isListenBtnShown = false
		}
	}
</script>

<div
	class={video.rtmps?.isConnected || video.screen?.isConnected || video.webcam?.isConnected
		? 'w-full h-full'
		: 'w-[500px] max-h-80'}
	on:mouseenter={() => (isHoverVideo = true)}
	on:mouseleave={() => (isHoverVideo = false)}
	on:click={unmuteTracks}>
	<div class="bg-base-200 relative w-full h-full rounded-md">
		<img
			bind:this={imgElement}
			loading="lazy"
			src={video.avatar}
			alt="user avatar"
			on:error={() =>
				(imgElement.src = `https://ui-avatars.com/api/?name=${video.username}&background=random`)}
			class="absolute inset-0 w-24 md:w-24 mask {video.planTier > 0
				? 'mask-hexagon'
				: 'mask-squircle'} object-cover m-auto" />
		<div class="absolute inset-0">
			{#if video.rtmps?.isConnected || video.screen?.isConnected}
				<span
					class="z-10 btn btn-sm btn-neutral font-medium text-white border-none items-center w-fit absolute top-2 left-2 {isHoverVideo
						? 'opacity-100'
						: 'opacity-50'}">
					{formattedTime}
				</span>
			{/if}
			{#if video.rtmps?.isConnected && video.rtmps?.trackType === 'rtmps'}
				<div class="absolute rounded-md w-full h-full">
					<iframe
						src={iframeUrl}
						class="rounded-md w-full h-full"
						allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;" />
				</div>
			{:else}
				<video
					bind:this={screen_element}
					id={`screen-${video._id}`}
					autoplay
					muted
					class="rounded-md w-full h-full" />
				<div
					use:draggable={{ bounds: 'parent' }}
					on:mousedown={onMouseDown}
					on:mouseup={onMouseUp}
					class={animate +
						' absolute ' +
						(!isScreenLive ? 'w-full bottom-0 left-0 h-full' : 'w-1/4 bottom-0 right-0')}>
					<video
						bind:this={webcam_element}
						id={`webcam-${video._id}`}
						autoplay
						muted
						class="rounded-md h-full w-full" />
				</div>
				<audio bind:this={audio_element} autoplay muted class="rounded-md w-0 h-0" />
			{/if}
			<div
				class="absolute left-2 bottom-2 rounded-md dropdown {video.rtmps?.isConnected
					? 'mb-16'
					: ''}">
				<label
					tabindex="0"
					class="{coloredRole.textColor} bg-base-100 btn btn-sm normal-case flex gap-1 {speakingValue >
					10
						? 'btn-outline'
						: 'border-transparent'}"
					>@{video.username}
					{#if video.planTier > 0}
						<div class="text-accent font-bold">
							<IconDrawerVerification />
						</div>
					{/if}
				</label>
				{#if showBanItem || showRoleItem}
					<ul
						tabindex="0"
						class="dropdown-content dropdown-top menu p-2 shadow bg-base-100 rounded-box w-52">
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
			{#if isListenBtnShown && video._id !== $page.data.user?.userId && (video.screen?.isConnected || video.audio?.isConnected)}
				<div class="absolute right-2 bottom-1 tooltip tooltip-top" data-tip="Enable audio">
					<button class="btn btn-sm btn-active rounded-md" on:click={unmuteTracks}
						><IconListen /></button>
				</div>
			{/if}
		</div>
	</div>
</div>
