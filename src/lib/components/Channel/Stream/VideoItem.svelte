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
	// import LibLoader from '$lib/components/Global/LibLoader.svelte'

	export let video: any, channel: any

	let role = '',
		coloredRole: any = {},
		webrtc_canvas_element: HTMLCanvasElement,
		webrtc_video_element: HTMLVideoElement,
		screen_element: HTMLVideoElement,
		webcam_element: HTMLVideoElement,
		webcam_container_element: HTMLDivElement,
		audio_element: HTMLAudioElement,
		webrtcWhip: WHIPClient,
		webrtcWhep: WHEPClient,
		prevVid: any,
		isMounted: boolean = false,
		isWebcamFocused: boolean = false,
		speakingValue: number = 0,
		streamTime: number = 0,
		timerInterval: any,
		formattedTime: string = '00:00:00',
		isHoverVideo: boolean = false,
		iframeUrl: string = ''

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

	$: if (isMounted && video?.isConnected !== prevVid?.isConnected) {
		handleRealtimeChanges()
	}

	$: toggleTimer(video.isConnected)

	$: animate = isWebcamFocused ? '' : 'transition-all'

	onMount(() => {
		handleRealtimeChanges()
		if (video._id === $page.data.user?.userId) {
			is_sharing_screen.subscribe(async (value: any) => {
				if (value === true) {
					getWebrtcWhip()
					await webrtcWhip?.accessLocalScreenMediaSources(
						webrtc_canvas_element,
						screen_element,
						webcam_element,
						webcam_container_element
					)
					webrtcWhip.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
					screen_element.addEventListener('dblclick', (event: any) => {
						if (document.fullscreenElement) {
							document.exitFullscreen()
						} else {
							screen_element.requestFullscreen()
						}
					})
					webrtcWhip.addEventListener(`localStreamStopped-screen`, () => {
						$is_sharing_screen = undefined
					})
				} else {
					if (value === false) webrtcWhip?.disconnectStreamScreen()
					if (screen_element) screen_element.srcObject = null
					isScreenLive = false
				}
			})

			is_sharing_webcam.subscribe(async (value: any) => {
				if (value === true) {
					getWebrtcWhip()
					await webrtcWhip?.accessLocalWebcamMediaSources(
						webrtc_canvas_element,
						screen_element,
						webcam_element,
						webcam_container_element
					)
					webrtcWhip.addEventListener(`isWebcamLive`, (ev: any) => (isWebcamLive = ev.detail))
					webcam_element.addEventListener('dblclick', (event: any) => {
						if (document.fullscreenElement) {
							document.exitFullscreen()
						} else {
							webcam_element.requestFullscreen()
						}
					})
					webrtcWhip.addEventListener(`localStreamStopped-webcam`, () => {
						$is_sharing_webcam = undefined
					})
				} else {
					if (value === false) webrtcWhip?.disconnectStreamWebcam()
					if (webcam_element) webcam_element.srcObject = null
					isWebcamLive = false
				}
			})

			is_sharing_audio.subscribe(async (value: any) => {
				if (value === true) {
					getWebrtcWhip()
					await webrtcWhip?.accessLocalAudioMediaSources(audio_element)
					webrtcWhip.addEventListener(`localStreamStopped-audio`, () => {
						webrtcWhip.removeEventListener(`localAudioSpeakingValue`, () => {})
						$is_sharing_audio = undefined
					})
					webrtcWhip.addEventListener(`localAudioSpeakingValue`, (ev: any) => {
						speakingValue = ev.detail
					})
				} else {
					if (value === false) webrtcWhip?.disconnectStreamAudio()
					if (audio_element) audio_element.srcObject = null
				}
			})
		}
		isMounted = true
	})

	const handleRealtimeChanges = () => {
		prevVid = video
		toggleClient()
	}

	const toggleClient = async () => {
		const trackType = video.trackType
		if ($page.data.user?.userId === video._id) {
			switch (trackType) {
				case 'rtmps':
					if (video.isConnected) {
						iframeUrl = video.playback?.iframe
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
					if (video.isConnected) {
						iframeUrl = video.playback?.iframe
					} else {
						iframeUrl = ''
					}
					break
				case 'webrtc':
					if (video.isConnected) {
						webrtcWhep = new WHEPClient(video.webRTCPlayback.url, webrtc_video_element)
						webrtcWhep.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
						webrtcWhep.addEventListener(`localAudioSpeakingValue`, (ev: any) => {
							speakingValue = ev.detail
						})
						webrtc_video_element.addEventListener('dblclick', (event: any) => {
							if (document.fullscreenElement) {
								document.exitFullscreen()
							} else {
								webrtc_video_element.requestFullscreen()
							}
						})
					} else {
						if (webrtc_video_element) webrtc_video_element.srcObject = null
						webrtcWhep?.removeEventListener(`localAudioSpeakingValue`, () => {})
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

	const getWebrtcWhip = () => {
		if (!webrtcWhip || webrtcWhip.peerConnection?.connectionState === 'closed') {
			webrtcWhip = new WHIPClient(video.webRTC.url)
		}
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
						const inputId = video.uid
						const streamRecord = await get(`analytics/stream?inputId=${inputId}`)
						streamTime = Math.floor((Date.now() - streamRecord?.start) / 1000)
					}
					streamTime += 1
					formattedTime = formatTime(streamTime)
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

	// const onLibLoaded = (event: any) => {
	// 	try {
	// 		// The Cloudflare Stream SDK is ready to use
	// 		streamPlayer = event.detail.library(obs_element)
	// 		streamPlayer.addEventListener('durationchange', (evt: any) => {
	// 			console.log('Duration change', evt)
	// 			streamTime = streamPlayer?.duration
	// 		})
	// 	} catch (err) {
	// 		console.log('err', err)
	// 	}
	// }
	// <LibLoader
	// 	src="https://embed.cloudflarestream.com/embed/sdk.latest.js"
	// 	libraryDetectionObject="Stream"
	// 	on:loaded={onLibLoaded}
	// />
</script>

<div
	class={video.isConnected ? 'w-full h-full' : 'w-[500px] max-h-80'}
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
			{#if video.isConnected}
				<span
					class="z-10 btn btn-sm btn-neutral font-medium text-white border-none items-center w-fit absolute top-2 left-2 {isHoverVideo
						? 'opacity-100'
						: 'opacity-50'}">
					{formattedTime}
				</span>
			{/if}
			{#if video.isConnected && video.trackType === 'rtmps'}
				<div class="absolute rounded-md w-full h-full">
					<iframe
						src={iframeUrl}
						class="rounded-md w-full h-full"
						allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;" />
				</div>
			{:else if $page.data.user?.userId === video._id}
				<video
					bind:this={screen_element}
					id={`screen-${video._id}`}
					autoplay
					muted
					class="rounded-md w-full h-full" />
				<div
					bind:this={webcam_container_element}
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
				<audio bind:this={audio_element} autoplay class="rounded-md w-0 h-0" />
				<canvas bind:this={webrtc_canvas_element} class="rounded-md w-full h-full hidden" />
			{:else}
				<video bind:this={webrtc_video_element} class="rounded-md w-full h-full" autoplay />
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
