<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import DrawerAddCategory from '$lib/components/Browse/DrawerAddCategory.svelte'
	import IconLink from '$lib/assets/icons/IconLink.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import { createEffect } from '$lib/utils'

	export let showDrawer: boolean
	export let profile: any

	let inputFields = [...profile.urls]

	const removeInputField = (index: number) => {
		inputFields = inputFields.filter((_, i) => i !== index)
	}

	const addInputField = () => {
		const lastField = inputFields[inputFields.length - 1]

		if (isValidURL(lastField)) {
			inputFields = [...inputFields, '']
		}
	}

	let isLastFieldValid = false

	const isValidURL = (url: string) => {
		const urlPattern = /^https?:\/\/\S+$/i
		return urlPattern.test(url)
	}

	$: {
		const lastField = inputFields[inputFields.length - 1]
		isLastFieldValid = isValidURL(lastField)
	}

	let params = $page.params

	const useOueryEffect = createEffect()

	let showAddCategory = false,
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

	let username: HTMLInputElement, submitBtn: any
	let prevUsername = ''

	$: useOueryEffect(() => {
		if ($page.status === 422 && $page.form && $page.form.username !== prevUsername) {
			submitBtn.disabled = false
			let v = username.value
			username.value = ''
			username.setCustomValidity('This username is already taken')
			submitBtn.click()
			username.value = v
			prevUsername = $page.form.username
		}
	}, [$page])

	$: useOueryEffect(() => {
		for (let key in $page.params) {
			if ($page.params[key] !== params[key]) {
				if (submitBtn) submitBtn.disabled = false
				toggleDrawer()
				break
			}
		}
	}, [$page.params])

	console.info('profile', profile)
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
				enctype="multipart/form-data"
				class="flex h-full p-5"
				action="?/update-profile"
				method="post"
				use:enhance={({ data }) => {
					if (profile?.category?.length) {
						data.append('category', JSON.stringify(profile?.category))
					}
				}}
				on:submit={() => {
					submitBtn.disabled = true
				}}>
				<div class="bg-base-200 w-80 md:w-[30rem] h-max flex flex-col rounded-lg">
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
							class="input input-primary input-bordered w-full"
							placeholder="Display name" />

						<input
							bind:value={profile.username}
							type="text"
							name="username"
							id="username"
							required
							class="input input-primary input-bordered mt-5 w-full"
							placeholder="Username"
							bind:this={username}
							on:input={() => {
								username.setCustomValidity('')
							}} />

						<input
							bind:value={profile.website}
							type="url"
							name="website"
							id="website"
							class="input input-primary input-bordered mt-5 w-full"
							placeholder="Your website URL" />

						<div class="form-control mt-5 w-full">
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="label">
								<span class="label-text">Social Links</span>
							</label>

							{#each inputFields as url, index (index)}
								<div class="flex flex-1 items-baseline mb-2 gap-3 w-full">
									<div class="relative w-full">
										<input
											bind:value={inputFields[index]}
											type="url"
											name={`urls`}
											id={`urls`}
											class="input input-primary input-bordered w-full"
											placeholder="Your website URL" />
										<div class="bg-primary w-max absolute right-0 top-0 p-2 h-[48px] rounded-r-lg">
											<IconLink />
										</div>
									</div>
									{#if index === inputFields.length - 1}
										<button
											type="button"
											class="btn btn-primary text-white"
											disabled={!isLastFieldValid}
											on:click={addInputField}>
											+
										</button>
									{:else}
										<button
											type="button"
											class="btn btn-neutral text-white"
											on:click={() => removeInputField(index)}>
											-
										</button>
									{/if}
								</div>
							{/each}

							<div class="form-control mt-5 w-full">
								<!-- svelte-ignore a11y-label-has-associated-control -->
								<label class="label">
									<span class="label-text">Banner</span>
								</label>
								<input
									type="file"
									accept="image/png, image/jpeg"
									name="banner"
									id="banner"
									class="file-input file-input-bordered file-input-primary w-full" />
							</div>

							<div class="form-control mt-5 w-full">
								<!-- svelte-ignore a11y-label-has-associated-control -->
								<label class="label">
									<span class="label-text">Avatar</span>
								</label>
								<input
									type="file"
									accept="image/png, image/jpeg"
									name="avatar"
									id="avatar"
									class="file-input file-input-bordered file-input-primary w-full" />
							</div>

							<div class="relative">
								<input
									on:click={() => (showAddCategory = true)}
									type="text"
									name="category-search"
									placeholder={profile?.category?.length ? '' : 'Category'}
									class="input input-primary input-bordered mt-5 w-full" />
								<span class="absolute right-0 top-1/2 text-gray-400 pr-3"
									>({maxCategoryLabel})</span>
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
							<button type="submit" class="btn btn-primary grow" bind:this={submitBtn}>Save</button>
						</div>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>
