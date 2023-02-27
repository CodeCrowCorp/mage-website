<script lang="ts">
	import IconPhoto from '$lib/assets/icons/IconPhoto.svelte'
	import { tags } from '$lib/stores/channelStore'
	import { onMount } from 'svelte'
	import Tags from 'svelte-tags-input'
	import DrawerAddCategory from './DrawerAddCategory.svelte'
	import { goto } from '$app/navigation'
	import { get, post, put } from '$lib/api'

	export let showDrawer: boolean

	let newChannel: any = {
			title: '',
			description: '',
			thumbnail: '',
			category: [],
			tags: [],
			isPrivate: false,
			user: '',
			channelType: ''
		},
		fileuploader: HTMLInputElement,
		thumbnailRef: any,
		showThumbnail = false,
		showAddCategory = false,
		categoryIcons: any = [],
		maxTag = 3,
		maxCategory = 4

	$: maxTagLabel = newChannel.tags.length == maxTag ? 'max reached' : 'max ' + maxTag
	$: maxCategoryLabel =
		newChannel.category.length == maxCategory ? 'max reached' : 'max ' + maxCategory

	onMount(async () => {
		if (!$tags.length) {
			const suggestedTags = await get(`tags`)
			$tags = suggestedTags
		}
	})

	const fileupload = async () => {
		const file = fileuploader.files && fileuploader.files[0]

		if (file) {
			const reader = new FileReader()
			reader.addEventListener('load', function () {
				thumbnailRef.setAttribute('src', reader.result)
			})
			reader.readAsDataURL(file)

			// newChannel.thumbnail = reader.result
			showThumbnail = true
			return
		}
		showThumbnail = false
	}

	const addTag = (tagName: string) => {
		tagName && newChannel.tags.length < maxTag ? newChannel.tags.push(tagName) : ''
		newChannel = newChannel
	}

	const addChannel = async () => {
		const channel = await post('/channel', newChannel)
		await put(`users/host-channels?hostChannelId=${channel._id}`)
		goto(`/channel/${channel._id}`)
	}
</script>

<div class="drawer drawer-end absolute w-full z-20 top-0 right-0">
	<input id="create-channel-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => (showDrawer = false)} class="drawer-overlay" />
		{#if showAddCategory}
			<DrawerAddCategory
				bind:showAddCategory
				bind:categoryIcons
				bind:categories={newChannel.category} />
		{:else}
			<form on:submit={() => addChannel()}>
				<div class="bg-base-200 w-80 md:w-[30rem] h-full flex flex-col">
					<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
						Create a new channel
					</p>
					<div class="flex flex-col p-3">
						<p class="text-s">
							When you create a channel, you may share your screen, webcam, and chat with the
							community
						</p>
						<p class="text-lg font-semibold mt-10">
							Please hide all sensitive data before going live.
						</p>

						<!-- <div class="flex flex-row justify-center w-full">
							<div class="card w-40 shadow-xl">
								<div class="card-body items-center max-h-40 {showThumbnail ? '!p-3' : ''}">
									{#if showThumbnail}
										<img bind:this={thumbnailRef} src="" alt="Preview" class="rounded-lg h-full" />
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
							class="file-input file-input-bordered file-input-primary w-full mt-5" /> -->
						<input
							bind:value={newChannel.title}
							type="text"
							name="title"
							required
							placeholder="Title"
							class="input input-primary input-bordered mt-5 w-full" />
						<textarea
							bind:value={newChannel.description}
							placeholder="Description"
							name="description"
							required
							class="textarea textarea-primary mt-5 text-base w-full h-28" />
						<p class="text-base text-gray-500 mt-5 mb-2">Suggested Tags</p>
						<div class="flex flex-wrap">
							{#if $tags && $tags.length > 0}
								{#each $tags as tag}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<span
										class="badge badge-md text-primary bg-gray-200 rounded-md font-semibold mx-1 cursor-pointer"
										on:click={() => addTag(tag.name)}>{tag.name}</span>
								{/each}
							{:else}
								<div class="flex justify-center w-full">
									<span class="btn btn-circle btn-outline btn-sm loading" />
								</div>
							{/if}
						</div>
						<div class="relative">
							<Tags
								bind:tags={newChannel.tags}
								maxTags={maxTag}
								id="tags"
								placeholder={newChannel.tags.length > 0 ? '' : 'Tags'} />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxTagLabel})</span>
						</div>
						<div class="relative">
							<input
								on:click={() => (showAddCategory = true)}
								type="text"
								name="category"
								required={!newChannel.category.length}
								placeholder={categoryIcons.length ? '' : 'Categories'}
								class="input input-primary input-bordered mt-5 w-full " />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxCategoryLabel})</span>
							<span class="absolute flex flex-row gap-2 left-0 top-1/2  pl-5">
								{#if categoryIcons.length}
									{#each categoryIcons as icon}
										<img src={icon} alt="" class="h-5 w-5" />
									{/each}
								{/if}
							</span>
						</div>
						<!-- <div class="flex flex-row mt-5 ">
							<input
								bind:checked={newChannel.isPrivate}
								type="checkbox"
								class="checkbox checkbox-primary mr-3" /> Private
						</div> -->
					</div>

					<div class="flex flex-row gap-2 mt-auto md:mb-4 p-3">
						<button type="button" class="btn btn-default grow" on:click={() => (showDrawer = false)}
							>Cancel</button>
						<button type="submit" class="btn btn-primary grow">Add</button>
					</div>
				</div>
			</form>
		{/if}
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
		--tw-bg-opacity: 1 !important;
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
		flex-wrap: nowrap !important;
	}
	:global(.svelte-tags-input-layout) {
		@apply mt-5 w-full;
	}
	:global(.svelte-tags-input-layout:focus-within) {
		outline: 2px solid hsl(var(--p)) !important;
		outline-offset: 2px !important;
	}
	:global(.svelte-tags-input) {
		width: 100%;
		font-size: 1rem !important;
		font-family: inherit !important;
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
	}

	:global(.svelte-tags-input-tag) {
		background-color: hsl(var(--p) / var(--tw-bg-opacity)) !important;
		padding-left: 0.5rem !important;
		padding-right: 0.5rem !important;
		border-radius: var(--rounded-badge, 1.5rem) !important;
	}
</style>
