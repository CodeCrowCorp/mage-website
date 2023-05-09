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
	import { del, post } from '$lib/api'
	import { page } from '$app/stores'
	import { emitAction } from '$lib/websocket'
	import {
		is_sharing_audio,
		is_sharing_screen,
		is_sharing_webcam,
		updateVideoItems,
		video_items
	} from '$lib/stores/streamStore'
	import { channel_connection } from '$lib/stores/websocketStore'

	export let isHostOrGuest: boolean = false

	$: isChannelSocketConnected = $channel_connection === 'open' && $page.data?.user?.userId
	$: videoItemIsActive = $video_items.some((video: any) => video._id === $page.data?.user?.userId)

	let screenUid: string = ''
	let webcamUid: string = ''
	let audioUid: string = ''

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
		return await post(
			`cloudflare/live-input?channelId=${$page.params.channelId}`,
			JSON.stringify(trackData),
			{
				userId: $page.data?.user?.userId,
				token: $page.data?.user?.token
			}
		)
	}

	const deleteLiveInput = async ({
		channelId,
		inputId
	}: {
		channelId: string
		inputId: string
	}) => {
		return await del(`cloudflare/live-input?channelId=${channelId}&inputId=${inputId}`, {
			userId: $page.data?.user?.userId,
			token: $page.data?.user?.token
		})
	}

	const startScreenStream = async () => {
		const liveInput = await createLiveInput({
			meta: {
				name: JSON.stringify({
					channel: `${$page.params.channelId}`,
					isTrackActive: true,
					trackType: 'screen',
					_id: $page.data.user.userId
				})
			},
			recording: { mode: 'off' }
		})
		screenUid = liveInput.uid
		$video_items = updateVideoItems($video_items, [liveInput])
		emitAction({
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
	}

	const stopScreenStream = async () => {
		await deleteLiveInput({ channelId: $page.params.channelId, inputId: screenUid })
		$video_items = updateVideoItems($video_items, [
			{ _id: $page.data.user.userId, trackType: 'screen', isTrackActive: false }
		])
		emitAction({
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
			meta: {
				name: JSON.stringify({
					channel: `${$page.params.channelId}`,
					isTrackActive: true,
					trackType: 'webcam',
					_id: $page.data.user.userId
				})
			},
			recording: { mode: 'off' }
		})
		webcamUid = liveInput.uid
		$video_items = updateVideoItems($video_items, [liveInput])
		emitAction({
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
	}

	const stopWebcamStream = async () => {
		await deleteLiveInput({ channelId: $page.params.channelId, inputId: webcamUid })
		$video_items = updateVideoItems($video_items, [
			{ _id: $page.data.user.userId, trackType: 'webcam', isTrackActive: false }
		])
		emitAction({
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
			meta: {
				name: JSON.stringify({
					channel: `${$page.params.channelId}`,
					isTrackActive: true,
					trackType: 'audio',
					_id: $page.data.user.userId
				})
			},
			recording: { mode: 'off' }
		})
		audioUid = liveInput.uid
		$video_items = updateVideoItems($video_items, [liveInput])
		emitAction({
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
	}

	const stopAudioStream = async () => {
		await deleteLiveInput({ channelId: $page.params.channelId, inputId: audioUid })
		$video_items = updateVideoItems($video_items, [
			{ _id: $page.data.user.userId, trackType: 'audio', isTrackActive: false }
		])
		emitAction({
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

	is_sharing_screen.subscribe((value) => {
		if (value) {
			startScreenStream()
		} else if (value === false) {
			stopScreenStream()
		}
	})

	is_sharing_webcam.subscribe((value) => {
		if (value) {
			startWebcamStream()
		} else if (value === false) {
			stopWebcamStream()
		}
	})

	is_sharing_audio.subscribe((value) => {
		if (value) {
			startAudioStream()
		} else if (value === false) {
			stopAudioStream()
		}
	})
</script>

<div class="flex gap-4">
	<button
		class="btn tooltip font-normal normal-case {$is_sharing_screen ? 'btn-primary' : ''}"
		data-tip="Screen"
		on:click={() => {
			$is_sharing_screen = !$is_sharing_screen
		}}
		disabled={!isHostOrGuest || !isChannelSocketConnected || !videoItemIsActive}>
		<IconShareScreen />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$is_sharing_webcam ? 'btn-primary' : ''}"
		data-tip="Webcam"
		on:click={() => {
			$is_sharing_webcam = !$is_sharing_webcam
		}}
		disabled={!isHostOrGuest || !isChannelSocketConnected || !videoItemIsActive}>
		<IconShareWebcam />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$is_sharing_audio ? 'btn-primary' : ''}"
		data-tip="Audio"
		on:click={() => {
			$is_sharing_audio = !$is_sharing_audio
		}}
		disabled={!isHostOrGuest || !isChannelSocketConnected || !videoItemIsActive}>
		<IconShareAudio />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$is_chat_drawer_open ? 'btn-primary' : ''}"
		data-tip="Chat"
		on:click={() => handleChatDrawer()}>
		<IconChatDrawer />
	</button>
</div>
