<script lang="ts">
	export let showDrawer: boolean
</script>

<div class="drawer drawer-end absolute w-full z-20 top-0 right-0">
	<input id="edit-profile-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => (showDrawer = false)} class="drawer-overlay" />

		<form action="#">
			<div class="bg-base-200 w-80 md:w-[30rem] h-full flex flex-col">
				<div class="p-3">
					<div class="sm:col-span-2">
						<label for="name" class="block mb-2 text-sm font-medium ">Display Name</label>
						<input
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
						<label for="item-weight" class="block mb-2 text-sm font-medium ">Avatar</label>

						<input
							type="file"
							name="item-weight"
							id="item-weight"
							class="file-input file-input-bordered mb-2 file-input-primary w-full" />
					</div>
					<div class="w-full">
						<label for="item-weight" class="block mb-2 text-sm font-medium ">Banner</label>
						<input
							type="file"
							name="item-weight"
							id="item-weight"
							class="file-input file-input-bordered mb-2 file-input-primary w-full" />
					</div>
					<div class="sm:col-span-2">
						<label for="description" class="block mb-2 text-sm font-medium ">Description</label>
						<textarea
							id="description"
							rows="4"
							class="block p-2.5 w-full textarea textarea-info"
							placeholder="Your description here" />
					</div>
				</div>
				<div class="flex flex-row gap-2 mt-auto md:mb-4 p-3">
					<button type="button" class="btn btn-default grow" on:click={() => (showDrawer = false)}
						>Cancel</button>
					<button type="submit" class="btn btn-primary grow">Add</button>
				</div>
			</div>
		</form>
	</div>
</div>
