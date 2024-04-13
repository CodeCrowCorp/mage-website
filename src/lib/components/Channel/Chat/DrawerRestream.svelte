<script lang="ts">
	import { onMount } from 'svelte'
	import { get, put, del, patch, post } from '$lib/api'
	import { page } from '$app/stores'
	import { isValidRtmp } from '$lib/utils'
	import { is_restream_drawer_open } from '$lib/stores/channelStore'
	import IconSocialTwitch from '$lib/assets/icons/social/IconSocialTwitch.svelte'
	import IconSocialYouTube from '$lib/assets/icons/social/IconSocialYouTube.svelte'
	import { is_feature_merge_platforms_enabled } from '$lib/stores/remoteConfigStore'

	$: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}
	let urlList: any = []
	let payload = {
		name: '',
		url: '',
		streamKey: ''
	}
	let loading = false
	let add_output_modal: any
	let confirm_modal = false
	let showAddModal = false
	let selectedOutputId: number
	let touched = false
	let restream_drawer = false

	$: cloudflareUrl = payload.url.includes('cloudflare')
	$: invalidUrl = !isValidRtmp(payload.url)

	$: disbaled =
		loading || !payload.name || !payload.url || !payload.streamKey || invalidUrl || cloudflareUrl

	const addNew = async () => {
		loading = true
		await put(`output`, payload, auth)
		loading = false
		await getRestreamUrls()
		showAddModal = false
		touched = false
		payload = {
			name: '',
			url: '',
			streamKey: ''
		}
	}

	const remove = async () => {
		loading = true
		await del(`output?outputId=${selectedOutputId}`, auth)
		await getRestreamUrls()
		loading = false
		confirm_modal = false
	}

	const getRestreamUrls = async () => {
		if ($page.data.user?.userId) {
			loading = true
			urlList = await get(`outputs`, auth)
			loading = false
		}
	}

	const confirm = (id: number) => {
		selectedOutputId = id
		confirm_modal = true
	}

	const onBlur = () => {
		touched = true
	}

	const overlayClick = (evt: any) => {
		const elt = evt?.target
		if (elt?.classList?.contains('drawer-overlay')) restream_drawer = false
	}

	onMount(async () => {
		getRestreamUrls()
	})

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
			const streamIngestUrlRes = await fetch('https://ingest.twitch.tv/ingests')
			const streamIngestUrlData: any = await streamIngestUrlRes.json()
			const filteredIngests = streamIngestUrlData.ingests.filter(
				(ingest: any) => ingest.availability === 1
			)
			const url = filteredIngests[0].url_template
			const ingestUrl = url.substring(0, url.lastIndexOf('/'))
			const linkRes = await get(
				`twitch/link?channelId=${$page.params.channelId}&ingestUrl=${ingestUrl}`,
				auth
			)
			if (linkRes.redirect) window.location.replace(linkRes.redirectUrl)
		} catch (err) {}
	}

	const linkYoutube = async () => {
		try {
			const linkRes = await get(`youtube/link?channelId=${$page.params.channelId}`, auth)
			if (linkRes.redirect) window.location.replace(linkRes.redirectUrl)
		} catch (error) {}
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
					{#if urlList && Array.isArray(urlList)}
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
										{item.name}
									</div>
									<div class="break-all">{item.url || ''}</div>
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
					{/if}
					<button
						class="btn btn-primary mt-3"
						disabled={urlList?.length > 9}
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
							{#if $is_feature_merge_platforms_enabled}
								<div class="flex gap-3 mb-4">
									<button
										class="btn btn-sm"
										on:click={linkTwitch}
										disabled={urlList &&
											Array.isArray(urlList) &&
											urlList.some((item) => item.platform === 'twitch')}
										><IconSocialTwitch /> Twitch
									</button>
									<!-- <button
										class="btn btn-sm"
										on:click={linkYoutube}
										disabled={urlList &&
											Array.isArray(urlList) &&
											urlList.some((item) => item.platform === 'youtube')}
										><IconSocialYouTube /> YouTube</button> -->
								</div>
							{/if}
							<label class="label">
								<span class="label-text">Name</span>
							</label>
							<input
								bind:value={payload.name}
								type="text"
								placeholder="Enter the destination name"
								class="input input-bordered w-full max-w-xs input-primary"
								maxlength="20" />
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="label mt-5">
								<span class="label-text">Server</span>
							</label>
							<input
								bind:value={payload.url}
								type="text"
								placeholder="Enter server url"
								class="input input-bordered w-full max-w-xs input-primary"
								on:blur={onBlur} />
							{#if touched && invalidUrl}
								<div class="text-error text-sm mt-2">Please enter a valid URL</div>
							{/if}
							{#if touched && !invalidUrl && cloudflareUrl}
								<div class="text-error text-sm mt-2">Cloudfare url not allowed</div>
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
										name: '',
										url: '',
										streamKey: ''
									}
								}}>Cancel</button>
							<button disabled={disbaled} class="btn btn-primary" on:click={addNew}> Save </button>
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
