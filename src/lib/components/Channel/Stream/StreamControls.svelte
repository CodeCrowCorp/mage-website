<script lang="ts">
	import IconShareScreen from '$lib/assets/icons/channel/IconShareScreen.svelte'
	import IconShareWebcam from '$lib/assets/icons/channel/IconShareWebcam.svelte'
	import IconShareAudio from '$lib/assets/icons/channel/IconShareAudio.svelte'
	import IconRestream from '$lib/assets/icons/channel/IconRestream.svelte'
	import IconStreamKey from '$lib/assets/icons/channel/IconStreamKey.svelte'
	import IconSources from '$lib/assets/icons/channel/IconSources.svelte'
	import { get, put } from '$lib/api'
	import { page } from '$app/stores'
	import { emitChannelUpdate } from '$lib/websocket'
	import {
		is_sharing_webrtc,
		is_sharing_rtmp,
		updateVideoItems,
		is_wip_webrtc
	} from '$lib/stores/streamStore'
	import { channel_connection } from '$lib/stores/websocketStore'
	import { onMount } from 'svelte'
	import IconAddGuest from '$lib/assets/icons/channel/IconAddGuest.svelte'
	import { is_restream_drawer_open } from '$lib/stores/channelStore'
	import IconRefresh from '$lib/assets/icons/IconRefresh.svelte'
	import IconCopy from '$lib/assets/icons/IconCopy.svelte'
	import { copyToClipboard } from '$lib/utils'

	export let isHostOrGuest: boolean = false,
		channel: any,
		isScrollable: boolean = false,
		viewers: any[] = []

	let selectedUser = 0,
		obs_modal: any = null,
		rtmps: any = null,
		copyTextUrl = 'Copy',
		copyTextKey = 'Copy',
		urlList: any = [],
		isSharingScreen = false,
		isSharingWebcam = false,
		isSharingAudio = false

	$: $is_sharing_webrtc = isSharingScreen || isSharingWebcam || isSharingAudio

	$: isHost = channel?.user === $page.data.user?.userId

	$: viewersWithOutHost = viewers.filter(
		(viewer) => viewer.userId !== channel.user && viewer.userId !== 'anon'
	)

	$: isChannelSocketConnected =
		$channel_connection === `open-${$page.params.channelId}` && $page.data.user?.userId
	$: videoItemIsActive = channel.videoItems.some(
		(video: any) => video._id === $page.data.user?.userId
	)

	const createLiveInput = async (trackData: any) => {
		return await put(`live-input`, trackData, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
	}

	const getLiveInput = async ({
		channelId,
		userId,
		trackType
	}: {
		channelId: string
		userId: string
		trackType: string
	}) => {
		return await get(`live-input?channelId=${channelId}&userId=${userId}&trackType=${trackType}`, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
	}

	const startScreenStream = async () => {
		let liveInput = await getLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'webrtc'
		})
		if (!liveInput) {
			liveInput = await createLiveInput({
				channelId: `${$page.params.channelId}`,
				userId: $page.data.user?.userId,
				trackType: 'screen',
				liveInput: {
					meta: {
						name: `${$page.params.channelId}-${$page.data.user.userId}-webrtc`
					},
					recording: { mode: 'off' }
				}
			})
		}
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
	}

	const stopScreenStream = async () => {
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'screen' }
		])
	}

	const startWebcamStream = async () => {
		let liveInput = await getLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'webrtc'
		})
		if (!liveInput) {
			liveInput = await createLiveInput({
				channelId: `${$page.params.channelId}`,
				userId: $page.data.user?.userId,
				trackType: 'webrtc',
				liveInput: {
					meta: {
						name: `${$page.params.channelId}-${$page.data.user.userId}-webrtc`
					},
					recording: { mode: 'off' }
				}
			})
		}
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
	}

	const stopWebcamStream = async () => {
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'webcam' }
		])
	}

	const startAudioStream = async () => {
		let liveInput = await getLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'webrtc'
		})
		if (!liveInput) {
			liveInput = await createLiveInput({
				channelId: `${$page.params.channelId}`,
				userId: $page.data.user?.userId,
				trackType: 'webrtc',
				liveInput: {
					meta: {
						name: `${$page.params.channelId}-${$page.data.user.userId}-webrtc`
					},
					recording: { mode: 'off' }
				}
			})
		}
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
	}

	const stopAudioStream = async () => {
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'audio' }
		])
	}

	onMount(() => {
		isScrollable = isHostOrGuest
	})

	const toggleGuest = (userId: string) => {
		if (channel.user === userId) return
		if (!channel.bans.includes(userId)) {
			let isEnabled = false
			if (!channel.guests.includes(userId) && channel.guests.length < 9) {
				channel.guests.push(userId)
				isEnabled = true
			} else {
				channel.guests = channel.guests.filter((guest: string) => guest !== userId)
			}
			emitChannelUpdate({
				channelSocket: channel.socket,
				channel,
				roleUpdate: { roleEvent: 'guest', isEnabled, userId: userId }
			})
		}
	}

	const changeCopyText = (label: string) => {
		label = 'Copied!'
		setTimeout(() => {
			label = 'Copy'
		}, 1000)
	}

	const refreshStreamKey = async () => {
		rtmps = null
		rtmps = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'rtmp',
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-rtmp`
				},
				recording: { mode: 'automatic' }
			}
		})
	}

	const showStreamKeyModal = async () => {
		obs_modal.showModal()
		rtmps = await getLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user?.userId,
			trackType: 'rtmp'
		})
		if (!rtmps) {
			await refreshStreamKey()
		}
		urlList = await get('outputs', {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		urlList = urlList.filter((url: any) => url.isEnabled)
		//TODO: call the APIs to update twitch/youtube channel information.
	}
</script>

<div class="flex flex-col sm:flex-row gap-4">
	<div class="dropdown dropdown-top dropdown-end py-3">
		<button
			tabindex="0"
			class="btn border-none tooltip tooltip-left font-normal normal-case {$is_sharing_webrtc ||
			$is_sharing_rtmp
				? 'btn-primary'
				: 'btn-neutral'}"
			data-tip="Sources"
			disabled={!isHostOrGuest || !isChannelSocketConnected || !videoItemIsActive}>
			<IconSources />
		</button>
		<ul tabindex="0" class="dropdown-content">
			<div class="flex flex-row gap-4 card p-3 bg-base-300">
				<button
					class="btn border-none tooltip font-normal normal-case {isSharingScreen
						? 'btn-primary'
						: 'btn-neutral'}"
					data-tip="Screen"
					on:click={() => {
						isSharingScreen = !isSharingScreen
					}}
					disabled={$is_wip_webrtc ||
						$is_sharing_rtmp ||
						!isHostOrGuest ||
						!isChannelSocketConnected ||
						!videoItemIsActive}>
					<IconShareScreen />
				</button>

				<button
					class="btn border-none tooltip font-normal normal-case {isSharingWebcam
						? 'btn-primary'
						: 'btn-neutral'}"
					data-tip="Webcam"
					on:click={() => {
						isSharingWebcam = !isSharingWebcam
					}}
					disabled={$is_wip_webrtc ||
						$is_sharing_rtmp ||
						!isHostOrGuest ||
						!isChannelSocketConnected ||
						!videoItemIsActive}>
					<IconShareWebcam />
				</button>

				<button
					class="btn border-none tooltip font-normal normal-case {isSharingAudio
						? 'btn-primary'
						: 'btn-neutral'}"
					data-tip="Audio"
					on:click={() => {
						isSharingAudio = !isSharingAudio
					}}
					disabled={$is_wip_webrtc ||
						$is_sharing_rtmp ||
						!isHostOrGuest ||
						!isChannelSocketConnected ||
						!videoItemIsActive}>
					<IconShareAudio />
				</button>

				<div class="divider lg:divider-horizontal" />

				<button
					class="btn border-none tooltip font-normal normal-case btn-neutral"
					data-tip="Stream key"
					on:click={() => showStreamKeyModal()}
					disabled={isSharingScreen ||
						isSharingWebcam ||
						isSharingAudio ||
						!isHostOrGuest ||
						!isChannelSocketConnected ||
						!videoItemIsActive}>
					<IconStreamKey />
				</button>
			</div>
		</ul>
	</div>

	<div class="flex flex-row gap-4 card">
		<button
			class="flex items-center btn border-none tooltip font-normal normal-case mt-3 {$is_restream_drawer_open
				? 'btn-primary'
				: 'btn-neutral'}"
			data-tip="Restream"
			on:click={() => {
				$is_restream_drawer_open = !$is_restream_drawer_open
			}}
			disabled={$is_sharing_rtmp ||
				isSharingScreen ||
				isSharingWebcam ||
				isSharingAudio ||
				!isHostOrGuest ||
				!isChannelSocketConnected ||
				!videoItemIsActive}>
			<IconRestream />
		</button>

		<div class="dropdown dropdown-top rounded-box pt-3">
			<button
				tabindex="0"
				class="flex items-center btn border-none tooltip tooltip-right font-normal normal-case btn-neutral"
				data-tip="Add guest"
				disabled={!isHost || !isChannelSocketConnected || !videoItemIsActive}>
				<IconAddGuest />
			</button>

			<ul
				tabindex="0"
				class="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-fit min-w-[200px]">
				{#if isHost && isChannelSocketConnected && videoItemIsActive}
					{#if viewersWithOutHost.length > 0}
						{#each viewersWithOutHost as user, idx}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<li
								on:click={() => {
									toggleGuest(user._id)
								}}>
								<span class={'text-sm w-full' + (selectedUser == idx ? ' bg-gray-800' : '')}>
									@{user.username}
								</span>
							</li>
						{/each}
					{:else if !viewersWithOutHost.length}
						<li>
							<span class={'text-sm w-full'}> No users available </span>
						</li>
					{/if}
				{/if}
			</ul>
		</div>
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

<dialog bind:this={obs_modal} class="modal">
	<form method="dialog" class="modal-box overflow-x-hidden">
		<h3 class="font-bold text-lg">Copy to OBS</h3>
		<p class="py-8">
			Server: <br />
			{#if !rtmps?.rtmps?.url}
				<span class="loading loading-dots loading-sm" />
			{:else}
				<div class="flex">
					<span>{rtmps?.rtmps?.url}</span>
					<div
						class="btn btn-ghost btn-sm tooltip"
						data-tip={copyTextUrl}
						on:click={() => {
							copyToClipboard(rtmps?.rtmps?.url)
							changeCopyText(copyTextUrl)
						}}>
						<IconCopy />
					</div>
				</div>
			{/if}
		</p>
		<p class="break-all">
			Stream Key: <br />
			{#if !rtmps?.rtmps?.streamKey}
				<span class="loading loading-dots loading-sm" />
			{:else}
				<div class="flex">
					<span>{rtmps?.rtmps?.streamKey}</span>
					<div
						class="btn btn-ghost btn-sm tooltip"
						data-tip={copyTextKey}
						on:click={() => {
							copyToClipboard(rtmps?.rtmps?.streamKey)
							changeCopyText(copyTextKey)
						}}>
						<IconCopy />
					</div>
					<div
						class="btn btn-ghost btn-sm tooltip"
						data-tip="Refresh key"
						on:click={() => {
							refreshStreamKey()
						}}>
						<IconRefresh />
					</div>
				</div>
			{/if}
		</p>
		<div class="pt-8 flex flex-wrap">
			<h5>Restreaming to:</h5>
			{#if urlList.length}
				{#each urlList as url}
					<div class="badge badge-success badge-outline mx-1">{url.title}</div>
				{/each}
			{:else}
				<div class="badge badge-ghost badge-outline mx-1">None</div>
			{/if}
		</div>
		<div class="modal-action">
			<button class="btn">Close</button>
		</div>
	</form>
</dialog>
