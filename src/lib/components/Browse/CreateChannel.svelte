<script lang="ts">
	import IconPhoto from '$lib/assets/icons/IconPhoto.svelte'
	import { tags, getTags } from '$lib/stores/channelStore'
	import { onMount } from 'svelte'
	import Tags from 'svelte-tags-input'

	let newChannel = {
			channelTitle: '',
			channelDescription: '',
			channelThumbnail: '',
			channelTags: [],
			channelCategory: '',
			channelIsPrivate: false
		},
		fileuploader: HTMLInputElement,
		thumbnail: any,
		showThumbnail = false,
		maxTag = 3

	onMount(async () => {
		if (!$tags.length) {
			await getTags()
		}
	})

	export let showDrawer: boolean

	const fileupload = async () => {
		const file = fileuploader.files && fileuploader.files[0]

		if (file) {
			const reader = new FileReader()
			reader.addEventListener('load', function () {
				thumbnail.setAttribute('src', reader.result)
			})
			reader.readAsDataURL(file)

			showThumbnail = true
			return
		}
		showThumbnail = false
	}

	const addTag = (tagName: string) => {
		tagName && newChannel.channelTags.length < maxTag ? newChannel.channelTags.push(tagName) : ''
		newChannel = newChannel
	}
	const addChannel = async () => {
		console.log(newChannel)
	}
</script>

<div class="drawer drawer-end absolute w-full z-20 top-1 right-0">
	<input id="create-channel-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => (showDrawer = false)} class="drawer-overlay" />
		<div class="bg-white p-3 md:w-[32rem]">
			<p class="text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
				Create a new channel
			</p>
			<p class="text-xs">
				When you create a channel, you may allow viewer's to observe your desktop as you host your
				channel
			</p>
			<div class="flex flex-col">
				<p class="text-lg font-semibold  mt-10">
					Please hide all sensitive data before going live.
				</p>

				<div class="flex flex-row justify-center w-full">
					<div class="card w-40 shadow-xl">
						<div class="card-body items-center max-h-40 {showThumbnail ? '!p-3' : ''}">
							{#if showThumbnail}
								<img bind:this={thumbnail} src="" alt="Preview" class="rounded-lg h-full" />
							{:else}
								<IconPhoto />
							{/if}
						</div>
					</div>
				</div>

				<input
					bind:this={fileuploader}
					on:change={fileupload}
					type="file"
					class="file-input file-input-bordered file-input-primary w-full mt-5" />

				<input
					bind:value={newChannel.channelTitle}
					type="text"
					placeholder="Title"
					class="input input-primary input-bordered mt-5 w-full" />
				<textarea
					bind:value={newChannel.channelDescription}
					placeholder="Description"
					class="textarea textarea-primary textarea-bordered mt-5 textarea-md w-full h-28" />
				<p class="text-base text-gray-500 mt-5">Suggested Tags</p>
				<div class="flex flex-wrap">
					{#if $tags && $tags.length > 0}
						{#each $tags as tag}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<span
								class="badge badge-primary mx-1 cursor-pointer"
								on:click={() => addTag(tag.name)}>{tag.name}</span>
						{/each}
					{:else}
						<div class="flex justify-center w-full">
							<span class="btn btn-circle btn-outline btn-sm loading" />
						</div>
					{/if}
				</div>
				<Tags bind:tags={newChannel.channelTags} maxTags={maxTag} placeholder="Tags" />

				<input
					bind:value={newChannel.channelCategory}
					type="text"
					placeholder="Categories"
					class="input input-primary input-bordered mt-5 w-full " />

				<div class="flex flex-row mt-5 ">
					<input
						bind:checked={newChannel.channelIsPrivate}
						type="checkbox"
						class="checkbox checkbox-primary mr-3" /> Private
				</div>

				<div class="flex flex-row mt-20 md:mt-32 gap-2">
					<button type="button" class="btn btn-default grow" on:click={() => (showDrawer = false)}
						>Cancel</button>
					<button type="button" class="btn btn-primary grow" on:click={() => addChannel()}
						>Add</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.svelte-tags-input-layout) {
		--tw-border-opacity: 1 !important;
		border-color: hsl(var(--p) / var(--tw-border-opacity)) !important;
		border-radius: var(--rounded-btn, 0.5rem) !important;
		height: 3rem;
		padding-left: 1rem !important;
		padding-right: 1rem !important;
	}
	:global(.svelte-tags-input-layout) {
		@apply mt-5 w-full;
	}
	:global(.svelte-tags-input-layout:focus-within) {
		outline: 2px solid hsl(var(--p)) !important;
		outline-offset: 2px !important;
	}
	:global(.svelte-tags-input) {
		font-size: 1rem !important;
		font-family: inherit !important;
	}

	:global(.svelte-tags-input-tag) {
		background-color: hsl(var(--p) / var(--tw-bg-opacity)) !important;
		padding-left: 0.5rem !important;
		padding-right: 0.5rem !important;
		border-radius: var(--rounded-badge, 1.5rem) !important;
	}
</style>
