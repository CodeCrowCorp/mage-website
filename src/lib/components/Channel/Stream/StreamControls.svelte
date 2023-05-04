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
	import { updateVideoItems, video_items } from '$lib/stores/streamStore'

	export let isHost: boolean = true,
		channel: any
	let isSharingScreen: boolean = false
	let isSharingWebcam: boolean = false
	let isSharingAudio: boolean = false
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
				userId: $page.data.user.userId,
				token: $page.data.user.token
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
			userId: $page.data.user.userId,
			token: $page.data.user.token
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
			recording: { mode: 'automatic' }
		})
		screenUid = liveInput.uid
		$video_items = updateVideoItems($video_items, [liveInput])
		emitAction({
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack-start',
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
				action: 'toggleTrack-stop',
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
			recording: { mode: 'automatic' }
		})
		webcamUid = liveInput.uid
		$video_items = updateVideoItems($video_items, [liveInput])
		emitAction({
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack-start',
				video: liveInput
			}
		})
	}

	const stopWebcamStream = async () => {
		await deleteLiveInput({ channelId: $page.params.channelId, inputId: webcamUid })
		$video_items = $video_items.filter(
			(video: any) => video.trackName !== `webcam-${$page.data.user.userId}`
		)
		emitAction({
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack-stop',
				video: {
					trackType: 'webcam',
					liveInput: { webcamUid },
					trackName: null,
					userId: $page.data.user.userId,
					username: $page.data.user.user.username
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
			recording: { mode: 'automatic' }
		})
		audioUid = liveInput.uid
		$video_items = updateVideoItems($video_items, [liveInput])
		emitAction({
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack-start',
				video: liveInput
			}
		})
	}

	const stopAudioStream = async () => {
		await deleteLiveInput({ channelId: $page.params.channelId, inputId: audioUid })
		$video_items = $video_items.filter(
			(video: any) => video.trackName !== `audio-${$page.data.user.userId}`
		)
		emitAction({
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack-stop',
				video: {
					trackType: 'audio',
					liveInput: { audioUid },
					trackName: null,
					userId: $page.data.user.userId,
					username: $page.data.user.user.username
				}
			}
		})
		audioUid = ''
	}

	$: isHostOrGuest = isHost || channel.guests.includes($page.data?.user?.userId)
</script>

<div class="flex gap-4">
	<button
		class="btn tooltip font-normal normal-case {isSharingScreen ? 'btn-primary' : ''}"
		data-tip="Screen"
		on:click={() => {
			isSharingScreen = !isSharingScreen
			isSharingScreen ? startScreenStream() : stopScreenStream()
		}}
		disabled={!isHostOrGuest}>
		<IconShareScreen />
	</button>

	<button
		class="btn tooltip font-normal normal-case {isSharingWebcam ? 'btn-primary' : ''}"
		data-tip="Webcam"
		on:click={() => {
			isSharingWebcam = !isSharingWebcam
			isSharingWebcam ? startWebcamStream() : stopWebcamStream()
		}}
		disabled={!isHostOrGuest}>
		<IconShareWebcam />
	</button>

	<button
		class="btn tooltip font-normal normal-case {isSharingAudio ? 'btn-primary' : ''}"
		data-tip="Audio"
		on:click={() => {
			isSharingAudio = !isSharingAudio
			isSharingAudio ? startAudioStream() : stopAudioStream()
		}}
		disabled={!isHostOrGuest}>
		<IconShareAudio />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$is_chat_drawer_open ? 'btn-primary' : ''}"
		data-tip="Chat"
		on:click={() => handleChatDrawer()}>
		<IconChatDrawer />
	</button>
</div>
