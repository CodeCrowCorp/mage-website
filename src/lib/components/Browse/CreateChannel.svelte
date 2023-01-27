<!-- <div class="drawer-side">
	<label for="create-channel-drawer" class="drawer-overlay" />
	<ul class="menu p-4 w-96 bg-base-100 text-base-content">
		<li><a>Sidebar Item 1</a></li>
		<li><a>Sidebar Item 2</a></li>
	</ul>
</div> -->

<!-- UI for modal -->

<input type="checkbox" id="create-channel-modal" class="modal-toggle" />
<label for="create-channel-modal" class="modal">
	<div class="modal-box relative">
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
				<span>Questions</span>
				<span>Questions</span>
				<span>Questions</span>
			</div>
			<input type="text" placeholder="Tags" class="input input-bordered mt-5 w-full" />
			<input type="text" placeholder="Categories" class="input input-bordered mt-5 w-full " />

			<div class="flex flex-row mt-5 ">
				<input type="checkbox" class="checkbox mr-3" /> Private
			</div>

			<div class="flex flex-row mt-32 gap-2">
				<button type="button" class="btn btn-default grow">Cancel</button>
				<button type="button" class="btn btn-primary grow">Add</button>
			</div>
		</div>
	</div>
</label>
