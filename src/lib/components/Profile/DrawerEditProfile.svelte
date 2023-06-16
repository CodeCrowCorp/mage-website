<script lang="ts">
	import { enhance } from '$app/forms'
	import DrawerAddCategory from '$lib/components/Browse/DrawerAddCategory.svelte'
	import { category_list } from '$lib/stores/channelStore'

	export let showDrawer: boolean
	export let profile: any

	let showAddCategory = false,
		categoryIcons: any = [],
		maxCategory = 4

	$: maxCategoryLabel =
		profile?.category && profile?.category.length == maxCategory
			? 'max reached'
			: 'max ' + maxCategory

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
	<input id="edit-profile-drawer" bind:this={refToggle} type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label
			for="edit-profile-drawer"
			on:keyup
			on:click={() =>
				setTimeout(() => {
					showDrawer = false
				}, 200)}
			class="drawer-overlay" />
		{#if showAddCategory}
			<DrawerAddCategory bind:showAddCategory bind:categories={profile.category} />
		{:else}
			<form
				class="flex h-full p-5"
				action="?/update-profile"
				method="post"
				use:enhance={({ data }) => {
					if (profile?.category?.length) {
						data.append('category', JSON.stringify(profile?.category))
					}
				}}>
				<div class="bg-base-200 w-80 md:w-[30rem] h-full flex flex-col rounded-lg">
					<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
						Update Profile
					</p>
					<div class="flex flex-col p-3">
						<input
							bind:value={profile.displayName}
							type="text"
							name="displayName"
							id="displayName"
							required
							class="input input-primary input-bordered mt-5 w-full"
							placeholder="Display name" />
						<input
							bind:value={profile.username}
							type="text"
							name="username"
							id="username"
							required
							class="input input-primary input-bordered mt-5 w-full"
							placeholder="Username"
							disabled />

						<input
							bind:value={profile.website}
							type="url"
							name="website"
							id="website"
							class="input input-primary input-bordered mt-5 w-full"
							placeholder="Your website URL" />

						<!-- <label for="banner" class="block my-2 text-sm font-medium ">Banner</label>
						<input
							bind:value={profile.banner}
							type="file"
							name="banner"
							id="banner"
							class="file-input file-input-bordered file-input-primary w-full" /> -->

						<label for="avatar" class="block my-2 text-sm font-medium ">Avatar</label>
						<input
							type="file"
							name="avatar"
							id="avatar"
							class="file-input file-input-bordered file-input-primary w-full" /> 

						<div class="relative">
							<input
								on:click={() => (showAddCategory = true)}
								type="text"
								name="category-search"
								placeholder={profile?.category?.length ? '' : 'Category'}
								class="input input-primary input-bordered mt-5 w-full" />
							<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxCategoryLabel})</span>
							<span class="absolute flex flex-row gap-2 left-0 top-1/2 pl-5">
								{#if profile?.category?.length}
									{#each profile?.category as icon}
										<img src={$category_list[icon]} alt="" class="h-5 w-5" />
									{/each}
								{/if}
							</span>
						</div>

						<textarea
							bind:value={profile.bio}
							id="bio"
							name="bio"
							class="block w-full mt-5 textarea h-28 input-primary"
							placeholder="Your bio here" />
					</div>

					<div class="flex flex-row gap-2 mt-auto md:mb-4 p-3">
						<button
							type="button"
							class="btn btn-neutral text-white grow"
							on:click={() => toggleDrawer()}>Cancel</button>
						<button type="submit" class="btn btn-primary grow" on:click={() => toggleDrawer()}
							>Save</button>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>
