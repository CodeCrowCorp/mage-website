<script lang="ts">
	// import IconPhoto from '$lib/assets/icons/IconPhoto.svelte'
	import { tags } from '$lib/stores/channelStore'
	import { onMount } from 'svelte'
	import Tags from 'svelte-tags-input'
	import DrawerAddCategory from '$lib/components/Browse/DrawerAddCategory.svelte'
	import { get } from '$lib/api'
	import { enhance } from '$app/forms'
	import { category_list } from '$lib/stores/channelStore'

	export let showDrawer: boolean

	let newChannel: any = {
			title: '',
			// thumbnail: '',
			description: '',
			isPrivate: false,
			category: [],
			tags: []
		},
		fileuploader: HTMLInputElement,
		thumbnailRef: any,
		showThumbnail = false,
		showAddCategory = false,
		maxTag = 3,
		maxCategory = 4,
		isLoadingChannel = false

	$: maxTagLabel = newChannel.tags.length == maxTag ? 'max reached' : 'max ' + maxTag
	$: maxCategoryLabel =
		newChannel.category.length == maxCategory ? 'max reached' : 'max ' + maxCategory

	onMount(async () => {
		let inputTags = document.getElementById('tags')
		inputTags?.setAttribute('maxlength', '20')
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

	const onValidation = (evt: any) => {
		if (Number(evt.target.value) < 1) {
			evt.target.setCustomValidity('Please fill out this field.')
		}
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
</script>

<div class="drawer drawer-end absolute w-full z-20 top-0 right-0">
	<input id="create-channel-drawer" bind:this={refToggle} type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label
			for="create-channel-drawer"
			on:keyup
			on:click={() =>
				setTimeout(() => {
					showDrawer = false
				}, 200)}
			class="drawer-overlay" />
		{#if showAddCategory}
			<DrawerAddCategory bind:showAddCategory bind:categories={newChannel.category} />
		{:else}
			<form
				class="flex lg:h-full p-5"
				action="?/create-channel"
				method="post"
				use:enhance={({ formData }) => {
					isLoadingChannel = true
					formData.append('newChannel', JSON.stringify(newChannel))
				}}>
				<div class="bg-base-200 w-80 md:w-[30rem] h-full flex flex-col rounded-lg lg:mb-0 mb-20">
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
							maxlength="50"
							class="input input-primary input-bordered mt-5 w-full" />
						<textarea
							bind:value={newChannel.description}
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
										class="badge badge-md text-secondary rounded-md font-semibold mx-1 cursor-pointer border-none my-1"
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
								class="input input-primary input-bordered"
								bind:tags={newChannel.tags}
								maxTags={maxTag}
								id="tags"
								placeholder={newChannel.tags.length > 0 ? '' : 'Tag'} />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxTagLabel})</span>
							{#if newChannel.tags.length === 0}
								<input
									type="number"
									name="mintags"
									required
									min="1"
									class="opacity-0 pointer-events-none absolute left-0 right-0 mx-auto bottom-0"
									bind:value={newChannel.tags.length}
									on:invalid={onValidation} />
							{/if}
						</div>
						<div class="relative">
							<input
								on:click={() => (showAddCategory = true)}
								type="text"
								name="category"
								placeholder={newChannel?.category?.length ? '' : 'Category'}
								class="input input-primary input-bordered mt-5 w-full" />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxCategoryLabel})</span>
							<span class="absolute flex flex-row gap-2 left-0 top-1/2 pl-5">
								{#if newChannel?.category?.length}
									{#each newChannel?.category as icon}
										<img src={$category_list[icon]} alt="" class="h-5 w-5" />
									{/each}
								{/if}
							</span>
							{#if newChannel.category.length === 0}
								<input
									type="number"
									name="mincats"
									required
									min="1"
									class="opacity-0 pointer-events-none absolute left-0 right-0 mx-auto bottom-0"
									bind:value={newChannel.category.length}
									on:invalid={onValidation} />
							{/if}
						</div>
					</div>

					<div class="flex flex-row gap-2 mt-auto p-3">
						<button type="button" class="btn btn-neutral grow" on:click={() => toggleDrawer()}
							>Cancel</button>
						<button
							type="submit"
							disabled={isLoadingChannel}
							class="btn btn-primary grow {isLoadingChannel ? 'loading' : ''}">Add</button>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>
