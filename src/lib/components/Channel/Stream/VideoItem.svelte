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
	import { getColoredRole, setRole } from '$lib/utils'
	import IconChatBan from '$lib/assets/icons/chat/IconChatBan.svelte'
	import { is_feature_stats_enabled, is_feature_obs_enabled } from '$lib/stores/remoteConfigStore'
	import { addScreen, getScreen, removeScreen } from '$lib/stream-utils'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { Player, DefaultUi, Hls } from '@vime/svelte'
	import { get, patch, post, put } from '$lib/api'

	export let streamId: any, video: any, channel: any

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
		obs_modal: any = null,
		player: any,
		hlsUrl: string = '',
		hasActiveObsStream = false

	// WHIP/WHEP variables that determine if stream is coming in
	$: isScreenLive = false
	$: isWebcamLive = false

	$: console.log('TESTING HLS', hlsUrl)

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

	$: if ($is_feature_stats_enabled && (isScreenLive || isWebcamLive || hasActiveObsStream)) {
		toggleTimer()
	}

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
					hlsUrl = video.obs?.playback?.hls
					console.log('got here---- video.obs.playback?.hls', hlsUrl)
					break
				case 'screen':
					if (video.screen && $is_sharing_screen) {
						if (streamId == '') {
							const streamData = await post(
								'stats/stream',
								{
									type: 'stream',
									userId: $page.data.user?.userId,
									user: $page.data.user,
									start: Date.now(),
									end: 0,
									duration: 0
								},
								{
									userId: $page.data.user?.userId,
									token: $page.data.user?.token
								}
							)
							streamId = streamData.insertedId
						}

						const key = video.screen.webRTC.url + '-' + video._id
						const existed = getScreen(key)
						screenWhip =
							existed ||
							new WHIPClient(video.screen.webRTC.url, screenElement, video.screen.trackType)
						if (existed) {
							existed.videoElement = screenElement
							screenElement.srcObject = existed.localStream
							$is_sharing_screen = true
							isScreenLive = true
						}
						addScreen(key, screenWhip)
						screenWhip.addEventListener(`localStreamStopped-${trackType}`, async () => {
							$is_sharing_screen = false
							isScreenLive = false
							removeScreen(key)
							if (streamId) {
								await patch(
									`stats/stream/end?streamId=${streamId}`,
									{},
									{
										userId: $page.data.user?.userId,
										token: $page.data.user?.token
									}
								)
								streamId = ''
							}
						})
						screenWhip.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
					} else if (!video.screen) {
						if (screenElement) {
							screenElement.srcObject = null
						}
						$is_sharing_screen = false
						isScreenLive = false
					}
					break
				case 'webcam':
					if (video.webcam && $is_sharing_webcam) {
						webcamWhip = new WHIPClient(
							video.webcam.webRTC.url,
							webcamElement,
							video.webcam.trackType
						)
						webcamWhip.addEventListener(`localStreamStopped-${trackType}`, async () => {
							$is_sharing_webcam = false
							isWebcamLive = false
						})
						webcamWhip.addEventListener(`isWebcamLive`, (ev: any) => (isWebcamLive = ev.detail))
					} else if (!video.webcam) {
						if (webcamElement) {
							webcamElement.srcObject = null
						}
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
				case 'obs':
					hlsUrl = video.obs?.playback?.hls
					console.log('got here---- video.obs.playback?.hls', hlsUrl)
					break
				case 'screen':
					if (video.screen && screenElement) {
						const key = video.screen.webRTCPlayback.url + '-' + video._id
						const existed = getScreen(key)
						screenWhep =
							existed ||
							new WHEPClient(video.screen.webRTCPlayback.url, screenElement, video.screen.trackType)
						if (existed) {
							existed.videoElement = screenElement
							screenElement.srcObject = existed.stream
							isScreenLive = true
							const streamRecord = await get(`stats/stream?streamId=${streamId}`)
							streamTime = streamRecord ? (Date.now() - streamRecord.start) / 1000 : 0
							toggleTimer()
						}

						addScreen(key, screenWhep)
						screenElement.muted = false
						screenElement.play()
						screenWhep.addEventListener(`isScreenLive`, (ev: any) => (isScreenLive = ev.detail))
					} else {
						if (screenElement) screenElement.srcObject = null
						isScreenLive = false
					}
					break
				case 'webcam':
					if (video.webcam && webcamElement) {
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
					if (video.audio && audioElement) {
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
		handleObsChanges()

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

	is_sharing_obs.subscribe((value: any) => {
		if (value === false) {
			// obsWhep?.disconnectStream()
			//TODO: check if stream is coming, if not, hide video
		} else if (value === true) {
			if (is_sharing_obs) obs_modal?.showModal()
		}
	})

	is_sharing_screen.subscribe(async (value: any) => {
		if (value === false) {
			screenWhip?.disconnectStream()
			clearInterval(timerInterval)
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

	const toggleTimer = () => {
		if (timerInterval) {
			clearInterval(timerInterval)
			timerInterval = null
		} else {
			timerInterval = setInterval(async () => {
				streamTime++
				const hours = Math.floor(streamTime / 3600)
				const minutes = Math.floor((streamTime % 3600) / 60)
				const seconds = streamTime % 60
				formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
					.toString()
					.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
				//NOTE: check if mine and has been 5 seconds
				if (video._id === $page.data.user?.userId && streamTime % 5 == 0) {
					await patch(
						`stats/stream?streamId=${streamId}`,
						{},
						{
							userId: $page.data.user?.userId,
							token: $page.data.user?.token
						}
					)
				}
			}, 1000)
		}
	}

	const onPlaybackReady = (e: any) => {
		console.log('onPlaybackReady', e)
		hasActiveObsStream = true
	}
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css" />

<div
	class={hlsUrl || isScreenLive || isWebcamLive ? 'w-full h-full' : 'w-[500px] max-h-80'}
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
			{#if $is_feature_stats_enabled && (isScreenLive || isWebcamLive || hasActiveObsStream)}
				<span
					class="btn btn-sm btn-neutral font-medium text-white border-none items-center w-fit absolute top-2 left-2 {isHoverVideo
						? 'opacity-100'
						: 'opacity-50'}">
					{formattedTime}
				</span>
			{/if}
			{#if $is_feature_obs_enabled && hlsUrl}
				<div class="absolute rounded-md w-full h-full">
					<Player
						theme="dark"
						on:vmPlaybackReady={onPlaybackReady}
						bind:this={player}
						controls
						autoplay
						muted>
						<Hls crossOrigin>
							<source data-src={hlsUrl} type="application/x-mpegURL" />
						</Hls>

						<DefaultUi />
					</Player>
				</div>
			{/if}

			<video
				bind:this={screenElement}
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
					bind:this={webcamElement}
					id={`webcam-${video._id}`}
					autoplay
					muted
					class="rounded-md h-full w-full" />
			</div>
			<video bind:this={audioElement} autoplay muted class="rounded-md w-0 h-0" />
			<div class="absolute left-2 bottom-2 rounded-md dropdown">
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

{#if $is_feature_obs_enabled}
	<dialog bind:this={obs_modal} class="modal">
		<form method="dialog" class="modal-box">
			<h3 class="font-bold text-lg">Copy to OBS</h3>
			<p class="py-4">
				Server: <br />
				{#if !video.obs?.rtmps?.url}
					<span class="loading loading-dots loading-sm" />
				{:else}
					{video.obs?.rtmps?.url}
				{/if}
			</p>
			<p class="py-4 break-all">
				Stream Key: <br />
				{#if !video.obs?.rtmps?.streamKey}
					<span class="loading loading-dots loading-sm" />
				{:else}
					{video.obs?.rtmps?.streamKey}
				{/if}
			</p>
			<div class="modal-action">
				<button class="btn">Close</button>
			</div>
		</form>
	</dialog>
{/if}

<!-- <style>
	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
	}

	:global(body) {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#container {
		width: 100%;
		max-width: 960px;
	}
</style> -->
