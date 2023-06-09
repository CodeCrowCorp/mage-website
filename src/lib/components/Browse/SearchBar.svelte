<script lang="ts">
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import DrawerCreateChannel from './DrawerCreateChannel.svelte'
	import { is_login_modal_open } from '$lib/stores/helperStore'
	import { page } from '$app/stores'

	export let query: string | null = ''

	let showDrawer = false
</script>

<div class="flex flex-col md:flex-row gap-4 p-5">
	<form method="GET" action={`/search`}>
		<div class="form-control">
			<div class="input-group relative">
				<input
					name="query"
					bind:value={query}
					type="search"
					placeholder="Search channels"
					class="input input-bordered input-primary w-96" />
				<button class="btn btn-square bg-neutral-content border-neutral-content border">
					<IconSearch />
				</button>
			</div>
		</div>
	</form>
	<div class="form-control">
		<label
			for="create-channel-drawer"
			class="btn w-[21rem] btn-primary gap-2 drawer-button"
			on:click={() => {
				if ($page.data.user) {
					showDrawer = true
				} else {
					$is_login_modal_open = true
				}
			}}>
			<IconCreate />
			Create a channel
		</label>
	</div>

	{#if showDrawer}
		<DrawerCreateChannel bind:showDrawer />
	{/if}
</div>
