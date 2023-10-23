<script lang="ts">
	import { onMount } from 'svelte'
	import { get, put, del } from '$lib/api.js'
	import { page } from '$app/stores'
	import { isValidURL } from '$lib/utils'

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

	const addNew = async () => {
		loading = true
		await await put('output', payload, auth)
		loading = false
		getAll()
		showAddModal = false
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
	<form method="dialog" class="modal-box">
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
	<form method="dialog" class="modal-box">
		<h3 class="font-bold text-lg">Add new stream</h3>

		{#if touched && invalidUrl}
			<div class="alert alert-warning mt-2">Please enter a valid URL</div>
		{/if}
		{#if touched && !invalidUrl && cloudFareUrl}
			<div class="alert alert-warning">Cloudfare urls not allowed</div>
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
	</form>
</dialog>
