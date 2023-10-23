<script lang="ts">
	import { onMount } from 'svelte'
	import { get, put, del } from '$lib/api.js'
	import { page } from '$app/stores'
	import { isValidURL } from '$lib/utils'
	import IconRestream from '$lib/assets/icons/channel/IconRestream.svelte'

	$: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}
	let urlList: any = []
	let payload = {
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

	const addNew = async () => {
		loading = true
		await await put('output', payload, auth)
		loading = false
		await getAll()
		showAddModal = false
		touched = false
		payload = {
			url: '',
			streamKey: ''
		}
	}

	const remove = async () => {
		loading = true
		await del(`/output?outputId=${selected}`, auth)
		await getAll()
		loading = false
		confirm_modal = false
	}

	const getAll = async () => {
		loading = true
		urlList = await get('outputs', auth)
		loading = false
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
	})
	
	$: cloudFareUrl = payload.url.includes('cloudflare') 
	$: invalidUrl = !isValidURL(payload.url)

	$: disbaled = loading || 
	!payload.url || 
	!payload.streamKey ||
	invalidUrl ||
	cloudFareUrl

</script>

<div class="drawer drawer-end">
	<input id="restream-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<!-- Page content here -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label
			for="restream-drawer"
			class="btn text-white border-none tooltip font-normal normal-case items-center flex {restream_drawer
				? 'btn-primary'
				: 'btn-neutral'}"
			data-tip="Restream"
			on:click={() => {
				restream_drawer = !restream_drawer
			}}>
			<IconRestream />
		</label>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="drawer-side z-50" on:click={overlayClick}>
		<label id="overlay" for="restream-drawer" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="relative menu p-4 w-96 h-[calc(100%-40px)] overflow-auto bg-base-200 text-base-content m-4 rounded-lg">
		<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
			Restream Urls
		</p>	
			
		<div class="flex flex-col">
			{#each urlList as item}
				<div class="bg-base-100 p-4 my-1 rounded flex justify-between items-center">
					<div class="flex-1">
						<div class="">{item.url}</div>
						<div>
							<input
								value="dummyvalues"
								type="password"
								placeholder="Type here"
								class="bg-transparent"
								disabled 
							/>
						</div>
					</div>
					<button on:click={() => confirm(item._id)} class="btn btn-sm btn-circle btn-ghost">
						✕
					</button>
				</div>
			{/each}
		</div>
		<button
			class="btn btn-primary mt-5"
			disabled={urlList.length > 9}
			on:click={() => {
				showAddModal = true
			}}>Add url</button>
		<dialog class={`modal ${confirm_modal && 'modal-open'}`}>
			<form on:keydown={(event) => event.key != 'Enter'} method="dialog" class="modal-box">
				<h3 class="font-bold text-lg">Delete restream url</h3>
				<p class="py-4">
					{loading ? 'Please wait...' : 'Are you sure you want to delete this Stream Url?'}
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

				{#if touched && invalidUrl}
					<div class="alert alert-warning mt-4">Please enter a valid URL</div>
				{/if}
				{#if touched && !invalidUrl && cloudFareUrl}
					<div class="alert alert-warning  mt-4">Cloudfare urls not allowed</div>
				{/if}
				<div class="form-control w-full pt-4">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label">
						<span class="label-text">Server</span>
					</label>
					<input
						bind:value={payload.url}
						type="text"
						placeholder="Enter server url"
						class="input input-bordered w-full max-w-xs input-primary" 
						on:blur={onBlur}
					/>
					
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
								url: '',
								streamKey: ''
							}
						}}>Cancel</button>
					<button
						disabled={disbaled}
						class="btn btn-primary"
						on:click={addNew}>
						Save
					</button>
				</div>
			</div>
		</dialog>

		<div 
			on:click={()=> {
				document.getElementById("overlay")?.click()
			}}
			class="p-4 bg-base-100 absolute left-0 bottom-0 w-full text-center cursor-pointer">
			Close
		</div>
		</ul>
	</div>
</div>

