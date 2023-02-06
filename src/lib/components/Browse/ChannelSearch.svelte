<script lang="ts">
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import CreateChannel from './CreateChannel.svelte'
	import { searchQuery, searchingChannel } from '$lib/stores/channelStore'

	let showDrawer = false

	function submit() {
		$searchingChannel = true

		setTimeout(() => {
			$searchingChannel = false
		}, 10000)
	}
</script>

<div class="flex flex-col md:flex-row gap-4 py-5 px-24">
	<form class="flex-1" method="GET" action="?/search" on:submit={submit}>
		<div class="form-control">
			<div class="input-group">
				<input
					name="q"
					type="text"
					bind:value={$searchQuery}
					placeholder="Search channels"
					class="input input-bordered input-primary w-full" />
				<button class="btn btn-square">
					<IconSearch />
				</button>
			</div>
		</div>
	</form>

	<div class="form-control">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<label
			for="create-channel-drawer"
			class="btn w-[16rem] btn-primary gap-2 drawer-button"
			on:click={() => (showDrawer = true)}>
			<IconCreate />
			Create a channel</label>
	</div>

	{#if showDrawer}
		<CreateChannel bind:showDrawer />
	{/if}
</div>
