<script lang="ts">
	export let showDrawer: boolean
	export let profile: any

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
			class="drawer-overlay"
			on:click={() => {
				setTimeout(() => {
					showDrawer = false
				}, 200)
			}} />

		<form action="/profile/{profile.username}?/updateProfile" method="post">
			<div class="bg-base-200 w-80 md:w-[30rem] h-full flex flex-col">
				<div class="p-3">
					<div class="sm:col-span-2">
						<label for="name" class="block mb-2 text-sm font-medium ">Display Name</label>
						<input
							bind:value={profile.displayName}
							type="text"
							name="name"
							id="name"
							class="input input-bordered w-full mb-2 input-info"
							placeholder="Super Mario" />
					</div>
					<div class="w-full">
						<label for="brand" class="block mb-2 text-sm font-medium ">Tag Name</label>
						<input
							type="text"
							name="brand"
							id="brand"
							class="input input-bordered w-full mb-2 input-info"
							placeholder="Product brand" />
					</div>
					<div class="w-full">
						<label for="url" class="block mb-2 text-sm font-medium ">URL</label>
						<input
							bind:value={profile.html_url}
							type="url"
							name="url"
							id="url"
							class="input input-bordered w-full mb-2 input-info"
							placeholder="https://github.com" />
					</div>
					<div class="w-full">
						<label for="category" class="block mb-2 text-sm font-medium ">Category</label>
						<select id="category" class="input input-bordered input-info mb-2 w-full">
							<option>Select category</option>
							<option value="TV">TV/Monitors</option>
							<option value="PC">PC</option>
							<option value="GA">Gaming/Console</option>
							<option value="PH">Phones</option>
						</select>
					</div>
					<!-- <div class="w-full">Add categories here</div> -->
					<div class="w-full">
						<label for="avatar" class="block mb-2 text-sm font-medium ">Avatar</label>

						<input
							type="file"
							name="avatar"
							id="avatar"
							class="file-input file-input-bordered mb-2 file-input-primary w-full" />
					</div>
					<div class="w-full">
						<label for="banner" class="block mb-2 text-sm font-medium ">Banner</label>
						<input
							type="file"
							name="banner"
							id="banner"
							class="file-input file-input-bordered mb-2 file-input-primary w-full" />
					</div>
					<div class="sm:col-span-2">
						<label for="description" class="block mb-2 text-sm font-medium ">Description</label>
						<textarea
							bind:value={profile.bio}
							id="description"
							name="description"
							rows="4"
							class="block p-2.5 w-full textarea textarea-info"
							placeholder="Your description here" />
					</div>
				</div>
				<div class="flex flex-row gap-2 mt-auto md:mb-4 p-3">
					<button type="button" class="btn btn-default grow" on:click={() => toggleDrawer()}
						>Cancel</button>
					<button type="submit" class="btn btn-primary grow">Save</button>
				</div>
			</div>
		</form>
	</div>
</div>
