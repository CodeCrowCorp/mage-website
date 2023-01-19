<script>
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
</script>

<div class="flex gap-4 py-5 pl-5">
	<div class="form-control">
		<div class="input-group">
			<input
				type="text"
				placeholder="Search channels"
				class="input input-bordered input-primary w-72" />
			<button class="btn btn-square">
				<IconSearch />
			</button>
		</div>
	</div>

	<button class="btn btn-wide btn-primary gap-2">
		<IconCreate />
		Create a channel</button>
</div>
