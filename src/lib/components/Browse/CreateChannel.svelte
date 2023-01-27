<script lang="ts">
	export let showDrawer: boolean
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
				<input type="file" class="file-input file-input-bordered file-input-primary w-full mt-5" />

				<input
					type="text"
					placeholder="Title"
					class="input input-primary input-bordered mt-5 w-full" />
				<textarea
					placeholder="Description"
					class="textarea textarea-primary textarea-bordered mt-5 textarea-md w-full h-28" />
				<p class="text-base text-gray-500 mt-5">Suggested Tags</p>
				<div class="flex flex-wrap">
					<span class="badge badge-primary mx-1">Questions</span>
					<span class="badge badge-primary mx-1">Questions</span>
					<span class="badge badge-primary mx-1">Questions</span>
				</div>
				<input
					type="text"
					placeholder="Tags"
					class="input input-primary input-bordered mt-5 w-full" />
				<input
					type="text"
					placeholder="Categories"
					class="input input-primary input-bordered mt-5 w-full " />

				<div class="flex flex-row mt-5 ">
					<input type="checkbox" class="checkbox checkbox-primary mr-3" /> Private
				</div>

				<div class="flex flex-row mt-20 md:mt-32 gap-2">
					<button type="button" class="btn btn-default grow" on:click={() => (showDrawer = false)}
						>Cancel</button>
					<button type="button" class="btn btn-primary grow">Add</button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- UI for modal -->

<!-- <input type="checkbox" id="create-channel-modal" class="modal-toggle" />
<label for="create-channel-modal" class="modal cursor-pointer">
	<label class="modal-box relative">
		<p class="text-xl mb-5 pb-2 border-purple-500 border-b-2">Create a new channel</p>
		<p class="text-xs">
			When you create a channel, you may allow viewer's to observe your desktop as you host your
			channel
		</p>
		<div class="flex flex-col">
			<p class="text-lg font-semibold  mt-10">Please hide all sensitive data before going live.</p>
			<input type="text" placeholder="Title" class="input input-bordered mt-5 w-full" />
			<textarea
				placeholder="Description"
				class="textarea textarea-bordered mt-5 textarea-md w-full h-28" />
			<p class="text-base text-gray-500 mt-5">Suggested Tags</p>
			<div class="flex flex-wrap">
				<span class="badge badge-primary mx-1">Questions</span>
				<span class="badge badge-primary mx-1">Questions</span>
				<span class="badge badge-primary mx-1">Questions</span>
			</div>
			<input type="text" placeholder="Tags" class="input input-bordered mt-5 w-full" />
			<input type="text" placeholder="Categories" class="input input-bordered mt-5 w-full " />

			<div class="flex flex-row mt-5 ">
				<input type="checkbox" class="checkbox mr-3" /> Private
			</div>

			<div class="flex flex-row mt-28 gap-2">
				<button type="button" class="btn btn-default grow" on:click={() => (showDrawer = false)}
					>Cancel</button>
				<button type="button" class="btn btn-primary grow">Add</button>
			</div>
		</div>
	</label>
</label> -->
