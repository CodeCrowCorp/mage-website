<script lang="ts">
	import { tags } from '$lib/stores/channelStore'
	import { onDestroy, onMount } from 'svelte'
	import Tags from 'svelte-tags-input'
	import DrawerAddCategory from '$lib/components/Browse/DrawerAddCategory.svelte'
	import { get } from '$lib/api'
	import { enhance } from '$app/forms'
	import { category_list } from '$lib/stores/channelStore'
	import { emitChannelUpdate } from '$lib/websocket'
	import IconChatScreenshot from '$lib/assets/icons/chat/IconChatScreenshot.svelte'
	import { captureScreenShot } from '$lib/utils'

	export let channel: any, showDrawer: boolean

	let fileuploader: HTMLInputElement,
		thumbnailRef: any,
		showThumbnail = false,
		showAddCategory = false,
		maxTag = 3,
		maxCategory = 4,
		imageSrc: string = ''

	$: maxTagLabel = channel?.tags.length == maxTag ? 'max reached' : 'max ' + maxTag
	$: maxCategoryLabel =
		channel?.category.length == maxCategory ? 'max reached' : 'max ' + maxCategory

	onMount(async () => {
		let inputTags = document.getElementById('tags')
		inputTags?.setAttribute('maxlength', '20')
		if (!$tags.length) {
			const suggestedTags = await get(`tags`)
			$tags = suggestedTags
		}
	})
	onDestroy(() => {
		showDrawer = false
	})

	const fileupload = async () => {
		const file = fileuploader.files && fileuploader.files[0]

		if (file) {
			const reader = new FileReader()
			reader.addEventListener('load', function () {
				thumbnailRef.setAttribute('src', reader.result)
			})
			reader.readAsDataURL(file)

			// channel.thumbnail = reader.result
			showThumbnail = true
			return
		}
		showThumbnail = false
	}

	const checkVideo = (e: any) => {
		e.preventDefault()
		showThumbnail = true
		if (channel.videoItems.length > 0) {
			imageSrc = captureScreenShot(channel)
		}
	}

	const addTag = (tagName: string) => {
		tagName && channel.tags.length < maxTag ? channel.tags.push(tagName) : ''
		channel = channel
	}

	let refToggle: any
	const toggleDrawer = () => {
		if (refToggle) {
			refToggle.checked = false
		}
		setTimeout(() => {
			showDrawer = false
		}, 200)
	}

	const onValidation = (evt: any) => {
		if (Number(evt.target.value) < 1) {
			evt.target.setCustomValidity('Please fill out this field.')
		}
	}
</script>

<div class="drawer drawer-end absolute right-0 z-10 top-0">
	<input id="edit-channel-drawer" bind:this={refToggle} type="checkbox" class="drawer-toggle" />

	<div class="drawer-side">
		<label
			on:keyup
			for="edit-channel-drawer"
			class="drawer-overlay"
			on:click={() =>
				setTimeout(() => {
					showDrawer = false
				}, 200)} />
		{#if showAddCategory}
			<DrawerAddCategory
				classes={'w-[415px] lg:w-[425px]'}
				bind:showAddCategory
				bind:categories={channel.category} />
		{:else}
			<form
				class="flex h-full p-5"
				action="?/edit-channel"
				method="post"
				use:enhance={({ data }) => {
					return ({ result }) => {
						if (result.type === 'success') {
							console.log('channel', channel)
							emitChannelUpdate({ channelSocket: channel.socket, channel })
							toggleDrawer()
						}
					}
				}}>
				<div class="bg-base-200 rounded-lg w-[415px] lg:w-[425px] h-full flex flex-col">
					<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
						Edit channel
					</p>
					<div class="flex flex-col p-3">
						<div class="flex flex-row justify-center w-full">
							<div class="card w-60 shadow-xl" on:click={checkVideo}>
								<div class="items-center max-h-40 cursor-pointer {showThumbnail ? '!p-3' : ''}">
									{#if imageSrc || channel.thumbnail}
										<img
											bind:this={thumbnailRef}
											src={imageSrc || channel.thumbnail}
											alt="Preview"
											class="rounded-lg h-full" />
									{:else}
										<div class="h-40 flex flex-col justify-center items-center">
											<IconChatScreenshot />
											Thumbnail
										</div>
									{/if}
								</div>
							</div>
						</div>
						<input type="hidden" name="imageSrc" value={imageSrc} />
						<input type="hidden" name="channelId" value={channel._id} />
						<input
							bind:this={fileuploader}
							on:change={fileupload}
							type="file"
							accept="image/png, image/jpeg"
							name="thumbnail"
							class="file-input file-input-bordered file-input-primary w-full mt-5" />
						<input
							bind:value={channel.title}
							type="text"
							name="title"
							required
							placeholder="Title"
							maxlength="50"
							class="input input-primary input-bordered mt-5 w-full" />
						<textarea
							bind:value={channel.description}
							placeholder="Description"
							name="description"
							required
							maxlength="500"
							class="textarea textarea-primary mt-5 text-base w-full h-28" />
						<p class="text-base text-gray-500 mt-5 mb-2">Suggested Tags</p>
						<div class="flex flex-wrap">
							{#if $tags && $tags.length > 0}
								{#each $tags as tag}
									<span
										class="badge badge-md text-secondary rounded-md font-semibold mx-1 cursor-pointer border-none"
										on:keyup
										on:click={() => addTag(tag.name)}>{tag.name}</span>
								{/each}
							{:else}
								<div class="flex justify-center w-full">
									<progress class="progress w-full" />
								</div>
							{/if}
						</div>
						<div class="relative">
							<Tags
								bind:tags={channel.tags}
								maxTags={maxTag}
								id="tags"
								placeholder={channel.tags.length > 0 ? '' : 'Tag'} />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxTagLabel})</span>
							{#if channel.tags.length === 0}
								<input
									type="number"
									name="mintags"
									required
									min="1"
									class="opacity-0 pointer-events-none absolute left-0 right-0 mx-auto bottom-0"
									bind:value={channel.tags.length}
									on:invalid={onValidation} />
							{/if}
						</div>
						<div class="relative">
							<input
								on:click={() => (showAddCategory = true)}
								type="text"
								name="category"
								required={!channel.category.length}
								placeholder={channel?.category?.length ? '' : 'Category'}
								class="input input-primary input-bordered mt-5 w-full" />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxCategoryLabel})</span>
							<span class="absolute flex flex-row gap-2 left-0 top-1/2 pl-5">
								{#if channel?.category?.length}
									{#each channel?.category as icon}
										<img src={$category_list[icon]} alt="" class="h-5 w-5" />
									{/each}
								{/if}
							</span>
						</div>
					</div>

					<div class="flex flex-row gap-2 mt-auto p-3">
						<button type="button" class="btn btn-neutral grow" on:click={() => toggleDrawer()}
							>Cancel</button>
						<button type="submit" class="btn btn-primary grow">Edit</button>
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
		/* background-color: hsl(var(--p) / var(--tw-bg-opacity)) !important; */
		padding-left: 0.5rem !important;
		padding-right: 0.5rem !important;
		border-radius: var(--rounded-badge, 1.5rem) !important;
	}
</style>
