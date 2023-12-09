<script lang="ts">
	import IconShareScreen from '$lib/assets/icons/channel/IconShareScreen.svelte'
	import IconShareWebcam from '$lib/assets/icons/channel/IconShareWebcam.svelte'
	import IconShareAudio from '$lib/assets/icons/channel/IconShareAudio.svelte'
	import IconRestream from '$lib/assets/icons/channel/IconRestream.svelte'
	import IconStreamKey from '$lib/assets/icons/channel/IconStreamKey.svelte'
	import IconSources from '$lib/assets/icons/channel/IconSources.svelte'
	import { del, get, post, put } from '$lib/api'
	import { page } from '$app/stores'
	import { emitChannelUpdate } from '$lib/websocket'
	import {
		is_sharing_audio,
		is_sharing_screen,
		is_sharing_webcam,
		is_sharing_obs,
		updateVideoItems,
		is_wip_webrtc
	} from '$lib/stores/streamStore'
	import { channel_connection } from '$lib/stores/websocketStore'
	import { onDestroy, onMount } from 'svelte'
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
		urlList: any = []

	$: isHost = channel?.user === $page.data.user?.userId

	$: viewersWithOutHost = viewers.filter(
		(viewer) => viewer.userId !== channel.user && viewer.userId !== 'anon'
	)

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

	const startScreenStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'screen',
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-screen`
				},
				recording: { mode: 'off' }
			}
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
	}

	const stopScreenStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'screen'
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'screen' }
		])
	}

	const startWebcamStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'webcam',
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-webcam`
				},
				recording: { mode: 'off' }
			}
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
	}

	const stopWebcamStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'webcam'
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'webcam' }
		])
	}

	const startAudioStream = async () => {
		const liveInput = await createLiveInput({
			channelId: `${$page.params.channelId}`,
			userId: $page.data.user?.userId,
			trackType: 'audio',
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-audio`
				},
				recording: { mode: 'off' }
			}
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [liveInput])
	}

	const stopAudioStream = async () => {
		await deleteLiveInput({
			channelId: $page.params.channelId,
			userId: $page.data.user.userId,
			trackType: 'audio'
		})
		channel.videoItems = updateVideoItems(channel.videoItems, [
			{ _id: $page.data.user.userId, trackType: 'audio' }
		])
	}

	onMount(() => {
		isScrollable = isHostOrGuest
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

		subcriptions.push(sub1, sub2, sub3)
	})

	onDestroy(() => {
		subcriptions.forEach((subs) => {
			subs()
		})
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
			trackType: 'obs',
			liveInput: {
				meta: {
					name: `${$page.params.channelId}-${$page.data.user.userId}-obs`
				},
				recording: { mode: 'automatic' }
			}
		})
	}

	const showStreamKeyModal = async () => {
		obs_modal.showModal()
		rtmps = await get(
			`live-input?channelId=${$page.params.channelId}&userId=${$page.data.user?.userId}`,
			{
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			}
		)
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
			class="btn border-none tooltip tooltip-left font-normal normal-case {$is_sharing_screen ||
			$is_sharing_webcam ||
			$is_sharing_audio ||
			$is_sharing_obs
				? 'btn-primary'
				: 'btn-neutral'}"
			data-tip="Sources"
			disabled={!isHostOrGuest || !isChannelSocketConnected || !videoItemIsActive}>
			<IconSources />
		</button>
		<ul tabindex="0" class="dropdown-content">
			<div class="flex flex-row gap-4 card p-3 bg-base-300">
				<button
					class="btn border-none tooltip font-normal normal-case {$is_sharing_screen
						? 'btn-primary'
						: 'btn-neutral'}"
					data-tip="Screen"
					on:click={() => {
						$is_sharing_screen = !$is_sharing_screen
					}}
					disabled={$is_wip_webrtc ||
						$is_sharing_obs ||
						!isHostOrGuest ||
						!isChannelSocketConnected ||
						!videoItemIsActive}>
					<IconShareScreen />
				</button>

				<button
					class="btn border-none tooltip font-normal normal-case {$is_sharing_webcam
						? 'btn-primary'
						: 'btn-neutral'}"
					data-tip="Webcam"
					on:click={() => {
						$is_sharing_webcam = !$is_sharing_webcam
					}}
					disabled={$is_wip_webrtc ||
						$is_sharing_obs ||
						!isHostOrGuest ||
						!isChannelSocketConnected ||
						!videoItemIsActive}>
					<IconShareWebcam />
				</button>

				<button
					class="btn border-none tooltip font-normal normal-case {$is_sharing_audio
						? 'btn-primary'
						: 'btn-neutral'}"
					data-tip="Audio"
					on:click={() => {
						$is_sharing_audio = !$is_sharing_audio
					}}
					disabled={$is_wip_webrtc ||
						$is_sharing_obs ||
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
					disabled={$is_sharing_screen ||
						$is_sharing_webcam ||
						$is_sharing_audio ||
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
			disabled={$is_sharing_obs ||
				$is_sharing_screen ||
				$is_sharing_webcam ||
				$is_sharing_audio ||
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
