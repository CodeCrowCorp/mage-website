<script lang="ts">
	import IconShare from '$lib/assets/icons/channel/IconShare.svelte'
	import IconShareScreen from '$lib/assets/icons/channel/IconShareScreen.svelte'
	import IconShareWebcam from '$lib/assets/icons/channel/IconShareWebcam.svelte'
	import IconShareAudio from '$lib/assets/icons/channel/IconShareAudio.svelte'
	import { del, post, put } from '$lib/api'
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
	import {
		is_feature_apps_enabled,
		is_feature_restream_enabled
	} from '$lib/stores/remoteConfigStore'
	import IconRestream from '$lib/assets/icons/channel/IconRestream.svelte'
	import RestreamDrawer from './RestreamDrawer.svelte'

	export let isHostOrGuest: boolean = false,
		channel: any,
		isScrollable: boolean = false

	$: isChannelSocketConnected =
		$channel_connection === `open-${$page.params.channelId}` && $page.data.user?.userId
	$: videoItemIsActive = channel.videoItems.some(
		(video: any) => video._id === $page.data.user?.userId
	)

	let subcriptions: any[] = []

	const createLiveInput = async (trackData: any) => {
		return await put(`live-input`, trackData, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
	}

	const sendFcm = async ({
		channelId,
		channelTitle,
		username
	}: {
		channelId: string
		channelTitle: string
		username: string
	}) => {
		if ($is_feature_apps_enabled) {
			return await post(
				`firebase/send-fcm`,
				{ channelId, channelTitle, username },
				{
					userId: $page.data.user?.userId,
					token: $page.data.user?.token
				}
			)
		}
	}

	const deleteLiveInput = async ({
		channelId,
		userId,
		trackType
	}: {
		channelId: string
		userId: string
		trackType: string
	}) => {
		if (channelId && userId && trackType) {
			return await del(
				`live-input?channelId=${channelId}&userId=${userId}&trackType=${trackType}`,
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
			userId: $page.data.user?.userId,
			trackType: 'obs',
			isTrackActive: true,
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-obs`
				},
				recording: { mode: 'automatic' }
			}
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
		await sendFcm({
			channelId: $page.params.channelId,
			channelTitle: channel.title,
			username: $page.data.user?.user?.username
		})
	}

	const stopObsStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'obs'
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
	}

	const startScreenStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'screen',
			isTrackActive: true,
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-screen`
				},
				recording: { mode: 'off' }
			}
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
		await sendFcm({
			channelId: $page.params.channelId,
			channelTitle: channel.title,
			username: $page.data.user?.user?.username
		})
	}

	const stopScreenStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'screen'
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
	}

	const startWebcamStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'webcam',
			isTrackActive: true,
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-webcam`
				},
				recording: { mode: 'off' }
			}
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
		await sendFcm({
			channelId: $page.params.channelId,
			channelTitle: channel.title,
			username: $page.data.user?.user?.username
		})
	}

	const stopWebcamStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'webcam'
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
	}

	const startAudioStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'audio',
			isTrackActive: true,
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-audio`
				},
				recording: { mode: 'off' }
			}
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
		emitAction({
			channelSocket: channel?.socket,
			channelId: $page.params.channelId,
			message: {
				action: 'toggleTrack',
				video: liveInput
			}
		})
		await sendFcm({
			channelId: $page.params.channelId,
			channelTitle: channel.title,
			username: $page.data.user?.user?.username
		})
	}

	const stopAudioStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'audio'
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

<div class="flex flex-col sm:flex-row gap-4">
	<div class="flex flex-row gap-4 card p-3 bg-base-300">
		<button
			class="btn text-white border-none tooltip font-normal normal-case {$is_sharing_screen
				? 'btn-primary'
				: 'btn-neutral'}"
			data-tip="Screen"
			on:click={() => {
				$is_sharing_screen = !$is_sharing_screen
			}}
			disabled={$is_sharing_obs ||
				!isHostOrGuest ||
				!isChannelSocketConnected ||
				!videoItemIsActive}>
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
			disabled={$is_sharing_obs ||
				!isHostOrGuest ||
				!isChannelSocketConnected ||
				!videoItemIsActive}>
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
			disabled={$is_sharing_obs ||
				!isHostOrGuest ||
				!isChannelSocketConnected ||
				!videoItemIsActive}>
			<IconShareAudio />
		</button>
	</div>
	<div class="flex flex-row gap-4 card p-3">
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

		{#if $is_feature_restream_enabled}
		<div class="drawer drawer-end">
			<input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content">
			  <!-- Page content here -->
			  <label for="my-drawer-4" 
			  class="btn text-white border-none tooltip font-normal normal-case items-center flex {$is_sharing_obs
				? 'btn-primary'
				: 'btn-neutral'}"
			data-tip="Restream">
				
				<IconRestream />
			
			  </label>
			</div> 
			<div class="drawer-side z-50">
			  <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
			  <ul class="menu p-4 w-96 min-h-full bg-base-200 text-base-content">
				<RestreamDrawer />
			  </ul>
			</div>
		  </div>
  
			
		{/if}
	</div>
</div>
<input
	type="checkbox"
	class="toggle toggle-primary toggle-xs tooltip absolute right-20 hidden sm:block"
	data-tip="Lock scroll"
	bind:checked={isScrollable}
	on:click={() => {
		isScrollable = !isScrollable
	}} />
