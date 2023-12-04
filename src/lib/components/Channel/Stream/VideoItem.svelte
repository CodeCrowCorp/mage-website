<script lang="ts">
	import WHEPClient from '$lib/WHEPClient'
	import WHIPClient from '$lib/WHIPClient'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import IconChatMod from '$lib/assets/icons/chat/IconChatMod.svelte'
	import IconChatGuest from '$lib/assets/icons/chat/IconChatGuest.svelte'
	import { draggable } from '@neodrag/svelte'
	import {
		is_sharing_audio,
		is_sharing_screen,
		is_sharing_webcam,
		is_sharing_obs
	} from '$lib/stores/streamStore'
	import { emitChannelUpdate } from '$lib/websocket'
	import { captureScreenShot, dataURLtoFile, getColoredRole, setRole } from '$lib/utils'
	import IconChatBan from '$lib/assets/icons/chat/IconChatBan.svelte'
	import { addScreen, getScreen, removeScreen } from '$lib/stream-utils'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { putImage } from '$lib/api'
	import LibLoader from '$lib/components/Global/LibLoader.svelte'

	export let video: any, channel: any

	let role = '',
		coloredRole: any = {},
		isGuest = false,
		obs_element: HTMLIFrameElement,
		screen_element: HTMLVideoElement,
		webcam_element: HTMLVideoElement,
		audio_element: HTMLAudioElement,
		screenWhip: WHIPClient,
		screenWhep: WHEPClient,
		webcamWhip: WHIPClient,
		webcamWhep: WHEPClient,
		audioWhip: WHIPClient,
		audioWhep: WHEPClient,
		prevObs: any,
		prevScreen: any,
		prevWebcam: any,
		prevAudio: any,
		isMounted: boolean = false,
		isWebcamFocused: boolean = false,
		speakingValue: number = 0,
		streamTime: number = 0,
		timerInterval: any,
		formattedTime: string = '00:00:00',
		isHoverVideo: boolean = false,
		iframeUrl: string = '',
		streamPlayer: any

	// WHIP/WHEP variables that determine if stream is coming in
	$: isScreenLive = false
	$: isWebcamLive = false

	$: if (channel) {
		role = setRole({ userId: video._id, channel, currentUserId: $page.data.user?.userId })
		coloredRole = getColoredRole(role)
	}

	$: showBanItem =
		(channel.user === $page.data.user?.userId ||
			channel?.mods?.includes($page.data.user?.userId)) &&
		channel.user !== video._id &&
		video._id !== $page.data.user?.userId &&
		role !== '🤖 AI'

	$: showRoleItem =
		channel.user === $page.data.user?.userId &&
		video._id !== $page.data.user?.userId &&
		role !== '🤖 AI'

	$: if (isMounted && video.obs !== prevObs) {
		handleObsChanges()
	}

	$: if (isMounted && video.screen !== prevScreen) {
		handleScreenChanges()
	}

	$: if (isMounted && video.webcam !== prevWebcam) {
		handleWebcamChanges()
	}

	$: if (isMounted && video.audio !== prevAudio) {
		handleAudioChanges()
	}

	// $: if (isScreenLive || iframeUrl) {
	// 	toggleTimer(true)
	// } else {
	// 	toggleTimer(false)
	// }

	$: animate = isWebcamFocused ? '' : 'transition-all'

	const handleObsChanges = () => {
		prevObs = video.obs
		toggleClient({
			trackType: 'obs'
		})
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

	const toggleClient = async ({ trackType }: { trackType: string }) => {
		if ($page.data.user?.userId === video._id) {
			switch (trackType) {
				case 'obs':
					if (video.obs) {
						iframeUrl = video.obs.playback.iframe
					} else {
						iframeUrl = ''
					}
					break
				case 'screen':
					if (video.screen && $is_sharing_screen) {
						const key = video.screen.webRTC.url + '-' + video._id
						const existed = getScreen(key)
						screenWhip =
							existed ||
							new WHIPClient(video.screen.webRTC.url, screen_element, video.screen.trackType)
						if (existed) {
							existed.videoElement = screen_element
							screen_element.srcObject = existed.localStream
							$is_sharing_screen = true
							isScreenLive = true
						}
						addScreen(key, screenWhip)
						screenWhip.addEventListener(`localStreamStopped-${trackType}`, async () => {
							$is_sharing_screen = false
							isScreenLive = false
							removeScreen(key)
						})
						screenWhip.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
					} else if (!video.screen) {
						if (screen_element) {
							screen_element.srcObject = null
						}
						$is_sharing_screen = false
						isScreenLive = false
					}
					break
				case 'webcam':
					if (video.webcam && $is_sharing_webcam) {
						webcamWhip = new WHIPClient(
							video.webcam.webRTC.url,
							webcam_element,
							video.webcam.trackType
						)
						webcamWhip.addEventListener(`localStreamStopped-${trackType}`, async () => {
							$is_sharing_webcam = false
							isWebcamLive = false
						})
						webcamWhip.addEventListener(`isWebcamLive`, (ev: any) => (isWebcamLive = ev.detail))
					} else if (!video.webcam) {
						if (webcam_element) {
							webcam_element.srcObject = null
						}
						$is_sharing_webcam = false
						isWebcamLive = false
					}
					break
				case 'audio':
					if (video.audio && $is_sharing_audio) {
						audioWhip = new WHIPClient(video.audio.webRTC.url, audio_element, video.audio.trackType)
						audioWhip.addEventListener(`localStreamStopped-${trackType}`, () => {
							$is_sharing_audio = false
							audioWhip.removeEventListener(`localAudioSpeakingValue`, () => {})
						})
						audioWhip.addEventListener(`localAudioSpeakingValue`, (ev: any) => {
							speakingValue = ev.detail
						})
					} else if (!video.audio) {
						if (audio_element) {
							audio_element.srcObject = null
						}
						$is_sharing_audio = false
					}
					break
			}
		} else {
			switch (trackType) {
				case 'obs':
					if (video.obs) {
						iframeUrl = video.obs.playback.iframe
					} else {
						iframeUrl = ''
					}
					break
				case 'screen':
					if (video.screen && screen_element) {
						const key = video.screen.webRTCPlayback.url + '-' + video._id
						const existed = getScreen(key)
						screenWhep =
							existed ||
							new WHEPClient(
								video.screen.webRTCPlayback.url,
								screen_element,
								video.screen.trackType
							)
						if (existed) {
							existed.videoElement = screen_element
							screen_element.srcObject = existed.stream
							isScreenLive = true //TODO: fixes scrolling to new stream, but breaks when host refreshes stream without ending
							screen_element.muted = false
							screen_element.play()
						}
						addScreen(key, screenWhep)
						screenWhep.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
					} else {
						if (screen_element) screen_element.srcObject = null
						isScreenLive = false
					}
					break
				case 'webcam':
					if (video.webcam && webcam_element) {
						webcamWhep = new WHEPClient(
							video.webcam.webRTCPlayback.url,
							webcam_element,
							video.webcam.trackType
						)
						webcamWhep.addEventListener(`isWebcamLive`, (ev: any) => (isWebcamLive = ev.detail))
					} else {
						if (webcam_element) webcam_element.srcObject = null
						isWebcamLive = false
					}
					break
				case 'audio':
					if (video.audio && audio_element) {
						audioWhep = new WHEPClient(
							video.audio.webRTCPlayback.url,
							audio_element,
							video.audio.trackType
						)
						audioWhep.addEventListener(`localAudioSpeakingValue`, (ev: any) => {
							speakingValue = ev.detail
						})
						audio_element.muted = false
						audio_element.play()
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

	onMount(() => {
		isGuest = channel?.guests?.includes(video._id)
		handleObsChanges()

		if (screen_element) {
			screen_element.addEventListener('dblclick', (event: any) => {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					screen_element.requestFullscreen()
				}
			})
			handleScreenChanges()
		}

		if (webcam_element) {
			webcam_element.addEventListener('dblclick', (event: any) => {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					webcam_element.requestFullscreen()
				}
			})
			handleWebcamChanges()
		}

		if (audio_element) {
			handleAudioChanges()
		}
		isMounted = true
	})

	//TODO: do this server-side
	// is_sharing_obs.subscribe(async (value: any) => {
	// 	if (value === false) {
	// 		if (timerInterval) toggleTimer(false)
	// 		if (streamId) {
	// 			await patch(
	// 				`analytics/stream/end?streamId=${streamId}`,
	// 				{},
	// 				{
	// 					userId: $page.data.user?.userId,
	// 					token: $page.data.user?.token
	// 				}
	// 			)
	// 			streamId = ''
	// 		}
	// 	}
	// })

	is_sharing_screen.subscribe(async (value: any) => {
		if (value === false) {
			screenWhip?.disconnectStream()
		}
	})

	is_sharing_webcam.subscribe((value: any) => {
		if (value === false) {
			webcamWhip?.disconnectStream()
		}
	})

	is_sharing_audio.subscribe((value: any) => {
		if (value === false) {
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
					streamTime = Math.floor(streamTime) + 1
					const hours = Math.floor(streamTime / 3600)
					const minutes = Math.floor((streamTime % 3600) / 60)
					const seconds = streamTime % 60
					formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
						.toString()
						.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
					if (
						!channel.thumbnail &&
						video._id === channel.user &&
						video._id === $page.data.user.userId &&
						streamTime === 60
					) {
						const imageSrc = captureScreenShot(channel)
						const file = dataURLtoFile(imageSrc, 'thumbnail-image')
						if (file !== null && file.size > 0 && file.type !== '') {
							await putImage(
								`channels/thumbnail?channelId=${channel._id}&bucketName=thumbnails`,
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

	const onLibLoaded = (event: any) => {
		if (obs_element && iframeUrl) {
			try {
				// The Cloudflare Stream SDK is ready to use
				streamPlayer = event.detail.library(obs_element)
				streamPlayer.addEventListener('durationchange', (event: any) => {
					console.log('Duration change', event)
				})
				// streamPlayer.muted = video._id === $page.data.user?.userId
				// streamPlayer.autoplay = true
				// streamPlayer.controls = false
				// streamPlayer.play()
			} catch (err) {
				console.log('err', err)
			}
		}
	}
</script>

<LibLoader
	src="https://embed.cloudflarestream.com/embed/sdk.latest.js"
	libraryDetectionObject="Stream"
	on:loaded={onLibLoaded} />

<div
	class={iframeUrl || isScreenLive || isWebcamLive ? 'w-full h-full' : 'w-[500px] max-h-80'}
	on:mouseenter={() => (isHoverVideo = true)}
	on:mouseleave={() => (isHoverVideo = false)}>
	<div class="bg-base-200 relative w-full h-full rounded-md">
		<img
			src={video.avatar}
			alt=""
			class="absolute inset-0 w-24 md:w-24 mask {video.planDetails?.planTier > 1
				? 'mask-hexagon'
				: 'mask-squircle'} object-cover m-auto" />
		<div class="absolute inset-0">
			{#if isScreenLive || iframeUrl}
				<span
					class="z-10 btn btn-sm btn-neutral font-medium text-white border-none items-center w-fit absolute top-2 left-2 {isHoverVideo
						? 'opacity-100'
						: 'opacity-50'}">
					{formattedTime}
				</span>
			{/if}
			{#if iframeUrl}
				<div class="absolute rounded-md w-full h-full">
					<iframe
						bind:this={obs_element}
						src={iframeUrl}
						class="rounded-md w-full h-full"
						allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;" />
				</div>
			{/if}
			{#if !iframeUrl}
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
				<video bind:this={audio_element} autoplay class="rounded-md w-0 h-0" />
			{/if}
			<div class="absolute left-2 bottom-2 rounded-md dropdown {iframeUrl ? 'mb-16' : ''}">
				<label
					tabindex="0"
					class="{coloredRole.textColor} bg-base-100 btn btn-sm normal-case flex gap-1 {speakingValue >
					10
						? 'btn-outline'
						: 'border-transparent'}"
					>@{video.username}
					{#if video.planDetails?.planTier > 1}
						<div class="text-accent font-bold">
							<IconDrawerVerification />
						</div>
					{/if}
				</label>
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
