<script lang="ts">
	import { onMount } from 'svelte'
	import { get, put, del, patch, post } from '$lib/api'
	import { page } from '$app/stores'
	import { getHref, isValidRtmp } from '$lib/utils'
	import {
		is_restream_drawer_open,
		streamStore,
		streamViewerCountStore
	} from '$lib/stores/channelStore'
	import IconSocialTwitch from '$lib/assets/icons/social/IconSocialTwitch.svelte'
	import IconSocialYouTube from '$lib/assets/icons/social/IconSocialYouTube.svelte'
	import { env } from '$env/dynamic/public'

	$: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}
	let urlList: any = []
	let payload = {
		title: '',
		url: '',
		streamKey: ''
	}
	let loading = false
	let add_output_modal: any
	let confirm_modal = false
	let showAddModal = false
	let selected = ''
	let touched = false
	let restream_drawer = false
	let ws: WebSocket
	let streamViewerCount: any
	let streamData: any

	// Subscribe to the streamViewerCount store
	$: streamViewerCount = $streamViewerCountStore
	$: streamData = $streamStore

	$: cloudflareUrl = payload.url.includes('cloudflare')
	$: invalidUrl = !isValidRtmp(payload.url)

	$: disabledYoutube =
		loading || !payload.title || !payload.url || invalidUrl || cloudflareUrl || !payload.streamKey

	$: disabledTwitch = loading || !payload.title || !payload.streamKey

	// invalidUrl ||
	// cloudflareUrl

	const addNew = async () => {
		loading = true
		await put(
			'output',
			{
				...payload,
				platform: selected
			},
			auth
		)
		loading = false
		await getAll()
		showAddModal = false
		touched = false
		payload = {
			title: '',
			url: '',
			streamKey: ''
		}
	}

	const remove = async () => {
		loading = true
		await del(`output?outputId=${selected}`, auth)
		await getAll()
		loading = false
		confirm_modal = false
	}

	const getAll = async () => {
		if ($page.data.user?.userId) {
			loading = true
			urlList = await get(`outputs`, auth)
			loading = false
			streamStore.set({
				title: urlList[0].title,
				url: urlList[0].url,
				streamKey: urlList[0].streamKey
			})
		}
	}

	const confirm = (id: string) => {
		selected = id
		confirm_modal = true
	}

	const onBlur = () => {
		touched = true
	}

	const overlayClick = (evt: any) => {
		const elt = evt?.target
		if (elt?.classList?.contains('drawer-overlay')) restream_drawer = false
	}

	onMount(() => {
		getAll()

		if (streamData && streamData.redirected) {
			selected = streamData.type
			if (streamData.type === 'youtube') getYoutubeStreamLink()
			else getTwitchStreamLink()
		}
	})

	$: {
		streamViewerCountStore.set(streamViewerCount)
	}
	$: {
		streamStore.set(streamData)
	}
	const getLiveInput = async () => {
		return await get(`live-input?channelId=${$page.params.channelId}&trackType=rtmps`, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
	}

	const sendOutputs = async ({ liveInputUid }: { liveInputUid: string }) => {
		if ($page.data.user?.userId) {
			return await post(
				`outputs/send`,
				{ liveInputUid },
				{
					userId: $page.data.user?.userId,
					token: $page.data.user?.token
				}
			)
		}
	}

	const toggleOutput = async (streamItem: any) => {
		streamItem.isEnabled = !streamItem.isEnabled
		streamItem = await patch(
			`output/toggle?outputId=${streamItem._id}`,
			{ isEnabled: streamItem.isEnabled },
			auth
		)
		urlList = urlList.map((item: any) =>
			item._id === streamItem._id ? { ...item, isEnabled: streamItem.isEnabled } : item
		)
		const rtmps = await getLiveInput()
		await sendOutputs({ liveInputUid: rtmps.rtmps.uid })
	}
	const linkTwitch = async () => {
		try {
			streamStore.set({
				streamKey: '',
				url: '',
				type: 'twitch',
				redirected: true
			})

			const linkRes = await get(`twitch/link?channelId=${$page.params.channelId}`, auth)

			if (linkRes.redirect) window.location.replace(linkRes.redirectUrl)
		} catch (err) {
			getTwitchStreamLink()
		}
	}

	const getTwitchStreamLink = async () => {
		const streamRes = await get(`twitch/stream/link?channelId=${$page.params.channelId}`, auth)

		if (streamRes.error === 404) return
		payload.streamKey = streamRes.streamKey
		selected = 'twitch'
		is_restream_drawer_open.set(true)
		showAddModal = true
		touched = false
		streamStore.set({
			streamKey: streamRes.streamKey,
			url: '',
			type: 'twitch',
			redirected: false
		})
	}

	const linkYoutube = async () => {
		try {
			streamStore.set({
				streamKey: '',
				url: '',
				type: 'youtube',
				redirected: true
			})

			const linkRes = await get(`youtube/link?channelId=${$page.params.channelId}`, auth)

			if (linkRes.redirect) window.location.replace(linkRes.redirectUrl)
		} catch (error) {
			getYoutubeStreamLink()
		}
	}

	const getYoutubeStreamLink = async () => {
		const streamRes = await get(`youtube/stream/link?channelId=${$page.params.channelId}`, auth)
		payload = {
			title: '',
			url: '',
			streamKey: ''
		}

		if (streamRes.error === 404) return
		;(payload.url = streamRes.streamaddress),
			(payload.streamKey = streamRes.streamKey),
			(selected = 'youtube')
		is_restream_drawer_open.set(true)
		showAddModal = true
		touched = false

		streamStore.set({
			streamKey: streamRes.streamKey,
			url: streamRes.streamaddress,
			type: 'youtube',
			redirected: false
		})

	}
</script>

<div class="drawer drawer-end">
	<input
		id="restream-drawer"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={$is_restream_drawer_open} />

	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div class="drawer-side z-50 overflow-x-hidden" on:click={overlayClick}>
		<label id="overlay" for="restream-drawer" aria-label="close sidebar" class="drawer-overlay" />
		<div class="flex lg:h-full p-5">
			<div class="bg-base-200 w-80 md:w-[24rem] h-full flex flex-col rounded-lg lg:mb-0 mb-20">
				<p
					class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2 justify-between flex">
					Restream Urls
				</p>
				<div class="flex flex-col p-3">
					<span class="text-warning"
						>Restreaming is currently only available for RTMPS streams</span>
					{#each urlList as item}
						<div
							class="bg-base-100 p-4 my-1 flex justify-between items-center h-fit font-normal normal-case rounded gap-3 border {item.isEnabled
								? 'border-success'
								: 'border-error'}">
							<input
								type="checkbox"
								checked={item.isEnabled}
								class="checkbox {item.isEnabled ? 'checkbox-success' : ''}"
								on:click={() => toggleOutput(item)} />
							<div class="flex-1 text-left space-y-1">
								<div class="break-all">
									{item.title}
								</div>
								<div class="break-all">{item.url}</div>
								<div>
									<input
										value="dummyvalues"
										type="password"
										placeholder="Type here"
										class="bg-transparent"
										disabled />
								</div>
							</div>
							<button on:click={() => confirm(item._id)} class="btn btn-sm btn-circle btn-ghost">
								✕
							</button>
						</div>
					{/each}
					<button
						class="btn btn-primary mt-3"
						disabled={urlList.length > 9}
						on:click={() => {
							showAddModal = true
							touched = false
						}}>
						Add url
					</button>
				</div>

				<dialog class={`modal ${confirm_modal && 'modal-open'}`}>
					<form on:keydown={(event) => event.key != 'Enter'} method="dialog" class="modal-box">
						<h3 class="font-bold text-lg">Delete restream url</h3>
						<p class="py-4">
							{loading ? 'Please wait...' : 'Are you sure you want to delete this url?'}
						</p>
						<div class="modal-action">
							{#if !loading}
								<button
									class="btn"
									disabled={loading}
									on:click={() => {
										confirm_modal = false
									}}>Cancel</button>
								<button disabled={loading} class="btn btn-primary" on:click={remove}>Yes</button>
							{/if}
						</div>
					</form>
				</dialog>

				<dialog bind:this={add_output_modal} class={`modal ${showAddModal && 'modal-open'}`}>
					<div class="modal-box">
						<h3 class="font-bold text-lg">Add new stream</h3>
						<div class="form-control w-full pt-4">
							<div class="flex gap-3">
								{#if env.PUBLIC_CROSS_ORIGIN === 'false'}
									<button class="btn btn-sm" on:click={linkTwitch}
										><IconSocialTwitch /> Twitch
									</button>
									<button class="btn btn-sm" on:click={linkYoutube}
										><IconSocialYouTube /> YouTube</button>
								{:else}
									<button
										class="btn btn-sm"
										on:click={async () =>
											await getHref({
												provider: 'twitch',
												apiUrl: env.PUBLIC_API_URL,
												xApiKey: env.PUBLIC_X_API_KEY
											})}><IconSocialTwitch /> Twitch</button>
									<button
										class="btn btn-sm"
										on:click={async () =>
											await getHref({
												provider: 'youtube',
												apiUrl: env.PUBLIC_API_URL,
												xApiKey: env.PUBLIC_X_API_KEY
											})}
										><IconSocialYouTube /> YouTube
									</button>
								{/if}
							</div>
							<label class="label">
								<span class="label-text">Title</span>
							</label>
							<input
								bind:value={payload.title}
								type="text"
								placeholder="Enter the destination name"
								class="input input-bordered w-full max-w-xs input-primary"
								maxlength="20" />
							<!-- svelte-ignore a11y-label-has-associated-control -->

							{#if selected === 'youtube' && payload.url}
								<label class="label mt-5">
									<span class="label-text">Server</span>
								</label>
								<input
									bind:value={payload.url}
									type="text"
									placeholder="Enter server url"
									class="input input-bordered w-full max-w-xs input-primary"
									on:blur={onBlur} />
							{/if}
							{#if touched && invalidUrl}
								<div class="text-error text-sm mt-2">Please enter a valid URL</div>
							{/if}
							{#if touched && !invalidUrl && cloudflareUrl}
								<div class="text-error text-sm mt-2">Cloudfare urls not allowed</div>
							{/if}
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="label mt-5">
								<span class="label-text">Stream Key</span>
							</label>
							<input
								bind:value={payload.streamKey}
								type="text"
								placeholder="Enter stream key"
								class="input input-bordered w-full max-w-xs input-primary" />
						</div>

						<div class="modal-action">
							<button
								class="btn"
								on:click={() => {
									showAddModal = false
									payload = {
										title: '',
										url: '',
										streamKey: ''
									}
								}}>Cancel</button>
							<button
								disabled={selected === 'youtube' ? disabledYoutube : disabledTwitch}
								class="btn btn-primary"
								on:click={addNew}>
								Save
							</button>
						</div>
					</div>
				</dialog>

				<div class="flex flex-row gap-2 mt-auto p-3">
					<button
						type="button"
						class="btn btn-neutral text-white grow w-full"
						on:click={() => {
							document.getElementById('overlay')?.click()
						}}>Close</button>
				</div>
			</div>
		</div>
	</div>
</div>
