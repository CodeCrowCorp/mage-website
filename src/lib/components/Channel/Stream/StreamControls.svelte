<script lang="ts">
	import IconShareScreen from '$lib/assets/icons/channel/IconShareScreen.svelte'
	import IconShareWebcam from '$lib/assets/icons/channel/IconShareWebcam.svelte'
	import IconShareAudio from '$lib/assets/icons/channel/IconShareAudio.svelte'
	import IconChatDrawer from '$lib/assets/icons/channel/IconChatDrawer.svelte'
	import { is_chat_drawer_open, is_chat_drawer_destroy } from '$lib/stores/channelStore'
	import { del, post } from '$lib/api'
	import { page } from '$app/stores'
	import { emitUserActions } from '$lib/websocket'
	import { video_items } from '$lib/stores/streamStore'

	export let isHost: boolean = true
	let isSharingScreen: boolean = false
	let isSharingWebcam: boolean = false
	let isSharingAudio: boolean = false
	let screenUid: string = ''
	let webcamUid: string = ''
	let audioUid: string = ''

	//TODO: show WHEP from websocket
	//const output = new WHEPClient(liveInput.webRTCPlayback.url, videoElement)

	const handleChatDrawer = () => {
		if ($is_chat_drawer_open) {
			$is_chat_drawer_open = false
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

	async function getLiveInput(trackData: any) {
		return await post(`cloudflare/live-input`, JSON.stringify(trackData), {
			userId: $page.data.user.userId,
			token: $page.data.user.token
		})
	}

	async function deleteLiveInput({ inputId }: { inputId: string }) {
		return await del(`cloudflare/live-input?inputId=${inputId}`, {
			userId: $page.data.user.userId,
			token: $page.data.user.token
		})
	}

	async function startScreenStream() {
		const trackName = `screen-${$page.data.user.userId}`
		const liveInput = await getLiveInput({
			meta: { name: trackName },
			recording: { mode: 'automatic' }
		})
		screenUid = liveInput.uid
		$video_items.push(liveInput)
		emitUserActions({
			channelId: $page.params.channelId,
			video: liveInput,
			message: JSON.stringify({ type: 'toggleTrack', trackType: 'screen' })
		})
	}

	async function stopScreenStream() {
		await deleteLiveInput({ inputId: screenUid })
		$video_items = $video_items.filter(
			(item: { meta: { name: string | string[] } }) => !item.meta.name.includes('screen')
		)
		emitUserActions({
			channelId: $page.params.channelId,
			video: { inputId: screenUid },
			message: JSON.stringify({ type: 'toggleTrack', trackType: 'screen' })
		})
	}

	async function startWebcamStream() {
		const trackName = `webcam-${$page.data.user.userId}`
		const liveInput = await getLiveInput({
			meta: { name: trackName },
			recording: { mode: 'automatic' }
		})
		webcamUid = liveInput.uid
		$video_items.push(liveInput)
		emitUserActions({
			channelId: $page.params.channelId,
			video: liveInput,
			message: JSON.stringify({ type: 'toggleTrack', trackType: 'webcam' })
		})
	}

	async function stopWebcamStream() {
		await deleteLiveInput({ inputId: webcamUid })
		$video_items = $video_items.filter(
			(item: { meta: { name: string | string[] } }) => !item.meta.name.includes('webcam')
		)
		emitUserActions({
			channelId: $page.params.channelId,
			video: { inputId: webcamUid },
			message: JSON.stringify({ type: 'toggleTrack', trackType: 'webcam' })
		})
		webcamUid = ''
	}

	async function startAudioStream() {
		const trackName = `audio-${$page.data.user.userId}`
		const liveInput = await getLiveInput({
			meta: { name: trackName },
			recording: { mode: 'automatic' }
		})
		audioUid = liveInput.uid
		$video_items.push(liveInput)
		emitUserActions({
			channelId: $page.params.channelId,
			video: liveInput,
			message: JSON.stringify({ type: 'toggleTrack', trackType: 'audio' })
		})
	}

	async function stopAudioStream() {
		await deleteLiveInput({ inputId: audioUid })
		//remove item from video_items if trackname includes audio
		$video_items = $video_items.filter(
			(item: { meta: { name: string | string[] } }) => !item.meta.name.includes('audio')
		)
		emitUserActions({
			channelId: $page.params.channelId,
			video: { inputId: audioUid },
			message: JSON.stringify({ type: 'toggleTrack', trackType: 'audio' })
		})
	}
</script>

<div class="flex gap-4">
	<button
		class="btn tooltip font-normal normal-case {isSharingScreen ? 'btn-primary' : ''}"
		data-tip="Screen"
		on:click={() => (isSharingScreen = !isSharingScreen)}
		disabled={!isHost}>
		<IconShareScreen />
	</button>

	<button
		class="btn tooltip font-normal normal-case {isSharingWebcam ? 'btn-primary' : ''}"
		data-tip="Webcam"
		on:click={() => (isSharingWebcam = !isSharingWebcam)}
		disabled={!isHost}>
		<IconShareWebcam />
	</button>

	<button
		class="btn tooltip font-normal normal-case {isSharingAudio ? 'btn-primary' : ''}"
		data-tip="Audio"
		on:click={() => (isSharingAudio = !isSharingAudio)}
		disabled={!isHost}>
		<IconShareAudio />
	</button>

	<button
		class="btn tooltip font-normal normal-case {$is_chat_drawer_open ? 'btn-primary' : ''}"
		data-tip="Chat"
		on:click={() => handleChatDrawer()}>
		<IconChatDrawer />
	</button>
</div>

<!-- <button>
    <IconShareRaiseHand/>
</button> -->
