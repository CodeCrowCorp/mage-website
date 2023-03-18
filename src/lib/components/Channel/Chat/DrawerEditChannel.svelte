<script lang="ts">
	// import IconPhoto from '$lib/assets/icons/IconPhoto.svelte'
	import { tags } from '$lib/stores/channelStore'
	import { onDestroy, onMount } from 'svelte'
	import Tags from 'svelte-tags-input'
	import DrawerAddCategory from '$lib/components/Browse/DrawerAddCategory.svelte'
	import { get } from '$lib/api'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { category_list } from '$lib/stores/channelStore'

	export let showDrawer: boolean

	let newChannel: any = {
			title: '',
			// thumbnail: '',
			description: '',
			isPrivate: false,
			category: [],
			tags: [],
			createdByDisplayName: $page.data.user.user.displayName,
			createdByUsername: $page.data.user.user.username,
			avatar: $page.data.user.user.avatar,
			channelType: 'channel'
		},
		fileuploader: HTMLInputElement,
		thumbnailRef: any,
		showThumbnail = false,
		showAddCategory = false,
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

<div class="drawer drawer-end absolute right-0 z-10 top-0">
	<input id="edit-channel-drawer" bind:this={refToggle} type="checkbox" class="drawer-toggle" />

	<div class="drawer-side m-5 rounded-lg">
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
				bind:categories={newChannel.category} />
		{:else}
			<form
				action="?/edit-channel"
				method="post"
				use:enhance={({ data }) => {
					data.append('newChannel', JSON.stringify(newChannel))
				}}>
				<div class="bg-base-200 rounded-lg w-[415px] lg:w-[425px] h-full flex flex-col">
					<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
						Edit channel
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
									<span
										class="badge badge-md text-primary bg-gray-200 rounded-md font-semibold mx-1 cursor-pointer border-none"
										on:keyup
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
								placeholder={newChannel.tags.length > 0 ? '' : 'Tag'} />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxTagLabel})</span>
						</div>
						<div class="relative">
							<input
								on:click={() => (showAddCategory = true)}
								type="text"
								name="category"
								required={!newChannel.category.length}
								placeholder={newChannel?.category?.length ? '' : 'Category'}
								class="input input-primary input-bordered mt-5 w-full " />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxCategoryLabel})</span>
							<span class="absolute flex flex-row gap-2 left-0 top-1/2  pl-5">
								{#if newChannel?.category?.length}
									{#each newChannel?.category as icon}
										<img src={$category_list[icon]} alt="" class="h-5 w-5" />
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
						<label
							on:keyup
							for="edit-channel-drawer"
							class="btn btn-default grow"
							on:click={() => toggleDrawer()}>Cancel</label>
						<button type="submit" class="btn btn-primary grow">Edit</button>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>
