<script lang="ts">
	import IconShareScreen from '$lib/assets/icons/channel/IconShareScreen.svelte'
	import IconShareWebcam from '$lib/assets/icons/channel/IconShareWebcam.svelte'
	import IconShareAudio from '$lib/assets/icons/channel/IconShareAudio.svelte'
	import IconChatDrawer from '$lib/assets/icons/channel/IconChatDrawer.svelte'
	import {
		is_chat_drawer_open,
		is_chat_drawer_destroy,
		was_chat_drawer_closed
	} from '$lib/stores/channelStore'
	import { del, put } from '$lib/api'
	import { page } from '$app/stores'
	import { emitAction } from '$lib/websocket'
	import {
		is_sharing_audio,
		is_sharing_screen,
		is_sharing_webcam,
		is_sharing_obs,
		updateVideoItems
	} from '$lib/stores/streamStore'
	import { channel_connection } from '$lib/stores/websocketStore'
	import { onDestroy, onMount } from 'svelte'
	import IconShareObs from '$lib/assets/icons/channel/IconShareObs.svelte'

	export let isHostOrGuest: boolean = false,
		channel: any,
		isScrollable: boolean = false

	$: isChannelSocketConnected =
		$channel_connection === `open-${$page.params.channelId}` && $page.data.user?.userId
	$: videoItemIsActive = channel.videoItems.some(
		(video: any) => video._id === $page.data.user?.userId
	)

	let obsUid: string = '',
		screenUid: string = '',
		webcamUid: string = '',
		audioUid: string = '',
		subcriptions: any[] = []

	const handleChatDrawer = () => {
		if ($is_chat_drawer_open) {
			$is_chat_drawer_open = false
			$was_chat_drawer_closed = true
			setTimeout(() => {
				$is_chat_drawer_destroy = true
			}, 300)
			return
		}

		$is_chat_drawer_destroy = false
		setTimeout(() => {
			$is_chat_drawer_open = !$is_chat_drawer_open
		}, 100)
	}

	const createLiveInput = async (trackData: any) => {
		return await put(`cloudflare/live-input`, trackData, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
	}

	const deleteLiveInput = async ({
		channelId,
		userId,
		trackType,
		inputId
	}: {
		channelId: string
		userId: string
		trackType: string
		inputId: string
	}) => {
		if (inputId) {
			return await del(
				`cloudflare/live-input?channelId=${channelId}&userId=${userId}&trackType=${trackType}&inputId=${inputId}`,
				{
					userId: $page.data.user?.userId,
					token: $page.data.user?.token
				}
			)
		}
	}

	const startObsStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user.userId,
			trackType: 'obs',
			isTrackActive: true,
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-obs`
				},
				recording: { mode: 'automatic' }
			}
		})
		obsUid = liveInput.uid
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
	}

	const stopObsStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'obs',
			inputId: obsUid
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'obs', isTrackActive: false }
		])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: {
					trackType: 'obs',
					isTrackActive: false,
					_id: $page.data.user.userId
				}
			}
		})
		obsUid = ''
	}

	const startScreenStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user.userId,
			trackType: 'screen',
			isTrackActive: true,
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-screen`
				},
				recording: { mode: 'off' }
			}
		})
		screenUid = liveInput.uid
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
	}

	const stopScreenStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'screen',
			inputId: screenUid
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'screen', isTrackActive: false }
		])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: {
					trackType: 'screen',
					isTrackActive: false,
					_id: $page.data.user.userId
				}
			}
		})
		screenUid = ''
	}

	const startWebcamStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user.userId,
			trackType: 'webcam',
			isTrackActive: true,
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-webcam`
				},
				recording: { mode: 'off' }
			}
		})
		webcamUid = liveInput.uid
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
	}

	const stopWebcamStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'webcam',
			inputId: webcamUid
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'webcam', isTrackActive: false }
		])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: {
					trackType: 'webcam',
					isTrackActive: false,
					_id: $page.data.user.userId
				}
			}
		})
		webcamUid = ''
	}

	const startAudioStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user.userId,
			trackType: 'audio',
			isTrackActive: true,
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-audio`
				},
				recording: { mode: 'off' }
			}
		})
		audioUid = liveInput.uid
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
	}

	const stopAudioStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'audio',
			inputId: audioUid
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'audio', isTrackActive: false }
		])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: {
					trackType: 'audio',
					isTrackActive: false,
					_id: $page.data.user.userId
				}
			}
		})
		audioUid = ''
	}

	onMount(() => {
		const sub1 = is_sharing_screen.subscribe((value) => {
			if (value) {
				startScreenStream()
			} else if (value === false) {
				stopScreenStream()
			}
		})

		const sub2 = is_sharing_webcam.subscribe((value) => {
			if (value) {
				startWebcamStream()
			} else if (value === false) {
				stopWebcamStream()
			}
		})

		const sub3 = is_sharing_audio.subscribe((value) => {
			if (value) {
				startAudioStream()
			} else if (value === false) {
				stopAudioStream()
			}
		})

		const sub4 = is_sharing_obs.subscribe((value) => {
			if (value) {
				startObsStream()
			} else if (value === false) {
				stopObsStream()
			}
		})

		subcriptions.push(sub1, sub2, sub3, sub4)
	})

	onDestroy(() => {
		subcriptions.forEach((subs) => {
			subs()
		})
	})
</script>

<div class="flex gap-4">
	<button
		class="btn text-white border-none tooltip font-normal normal-case {$is_sharing_screen
			? 'btn-primary'
			: 'btn-neutral'}"
		data-tip="Screen"
		on:click={() => {
			$is_sharing_screen = !$is_sharing_screen
		}}
		disabled={$is_sharing_obs || !isHostOrGuest || !isChannelSocketConnected || !videoItemIsActive}>
		<IconShareScreen />
	</button>

	<button
		class="btn text-white border-none tooltip font-normal normal-case {$is_sharing_webcam
			? 'btn-primary'
			: 'btn-neutral'}"
		data-tip="Webcam"
		on:click={() => {
			$is_sharing_webcam = !$is_sharing_webcam
		}}
		disabled={$is_sharing_obs || !isHostOrGuest || !isChannelSocketConnected || !videoItemIsActive}>
		<IconShareWebcam />
	</button>

	<button
		class="btn text-white border-none tooltip font-normal normal-case {$is_sharing_audio
			? 'btn-primary'
			: 'btn-neutral'}"
		data-tip="Audio"
		on:click={() => {
			$is_sharing_audio = !$is_sharing_audio
		}}
		disabled={$is_sharing_obs || !isHostOrGuest || !isChannelSocketConnected || !videoItemIsActive}>
		<IconShareAudio />
	</button>

	<button
		class="btn text-white border-none tooltip font-normal normal-case {$is_sharing_obs
			? 'btn-primary'
			: 'btn-neutral'}"
		data-tip="OBS"
		on:click={() => {
			$is_sharing_obs = !$is_sharing_obs
		}}
		disabled={$is_sharing_screen ||
			$is_sharing_webcam ||
			$is_sharing_audio ||
			!isHostOrGuest ||
			!isChannelSocketConnected ||
			!videoItemIsActive}>
		<IconShareObs />
	</button>

	<button
		class="btn text-white border-none tooltip font-normal normal-case {$is_chat_drawer_open
			? 'btn-primary'
			: 'btn-neutral'}"
		data-tip="Chat"
		on:click={() => handleChatDrawer()}>
		<IconChatDrawer />
	</button>
</div>
<input
	type="checkbox"
	class="toggle toggle-primary toggle-xs tooltip absolute right-20 hidden sm:block"
	data-tip="Lock scroll"
	bind:checked={isScrollable}
	on:click={() => {
		isScrollable = !isScrollable
	}} />
