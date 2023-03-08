<script lang="ts">
	import DrawerAddCategory from '$lib/components/Browse/DrawerAddCategory.svelte'

	export let showDrawer: boolean
	export let profile: any

	let showAddCategory = false,
		categoryIcons: any = [],
		maxCategory = 4

	$: maxCategoryLabel =
		profile.category && profile.category.length == maxCategory
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
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label
			for="edit-profile-drawer"
			on:click={() =>
				setTimeout(() => {
					showDrawer = false
				}, 200)}
			class="drawer-overlay" />
		{#if showAddCategory}
			<DrawerAddCategory
				bind:showAddCategory
				bind:categoryIcons
				bind:categories={profile.category} />
		{:else}
			<form action="/profile/{profile.username}?/updateProfile" method="post">
				<div class="bg-base-200 w-80 md:w-[30rem] h-full flex flex-col">
					<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">
						Update Profile
					</p>
					<div class="flex flex-col p-3">
						<input
							bind:value={profile.displayName}
							type="text"
							name="name"
							id="name"
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
							placeholder="Username" />

						<input
							bind:value={profile.html_url}
							type="text"
							name="url"
							id="url"
							required
							class="input input-primary input-bordered mt-5 w-full"
							placeholder="Your website URL" />

						<label for="banner" class="block my-2 text-sm font-medium ">Banner</label>
						<input
							type="file"
							name="banner"
							id="banner"
							class="file-input file-input-bordered file-input-primary w-full" />

						<label for="avatar" class="block my-2 text-sm font-medium ">Avatar</label>
						<input
							type="file"
							name="banner"
							id="banner"
							class="file-input file-input-bordered file-input-primary w-full" />

						<div class="relative">
							<input
								on:click={() => (showAddCategory = true)}
								type="text"
								name="category"
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

						<textarea
							bind:value={profile.bio}
							id="description"
							name="description"
							class="block w-full mt-5 textarea h-28 input-primary"
							placeholder="Your description here" />
					</div>

					<div class="flex flex-row gap-2 mt-auto md:mb-4 p-3">
						<button type="button" class="btn btn-default grow" on:click={() => toggleDrawer()}
							>Cancel</button>
						<button type="submit" class="btn btn-primary grow">Save</button>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>
