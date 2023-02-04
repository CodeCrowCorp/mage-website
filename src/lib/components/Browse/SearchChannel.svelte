<script lang="ts">
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import CreateChannelDrawer from './CreateChannelDrawer.svelte'
	import { current_user } from '$lib/stores/authStore'

	let showDrawer = false
</script>

<div class="flex flex-col md:flex-row gap-4 py-5 pl-5">
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

	<button
		class="btn w-[21rem] btn-primary gap-2 drawer-button"
		disabled={!$current_user}
		on:click={() => (showDrawer = true)}>
		<IconCreate />
		Create a channel</button>

	{#if showDrawer}
		<CreateChannelDrawer bind:showDrawer />
	{/if}
</div>
