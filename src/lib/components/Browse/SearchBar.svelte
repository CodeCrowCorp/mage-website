<script lang="ts">
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import IconCross from '$lib/assets/icons/IconCross.svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import CreateChannelDrawer from './CreateChannelDrawer.svelte'
	import { current_user } from '$lib/stores/authStore'
	import { is_login_modal_open } from '$lib/stores/helperStore'

	export let searchPage = false
	export let search_query: string | null = ''

	let showDrawer = false
</script>

<div class="flex flex-col md:flex-row gap-4 py-5 pl-5 {searchPage ? 'px-4 md:px-24' : ''}">
	<form class={searchPage ? 'flex-1' : ''} method="GET" action={`/search`}>
		<div class="form-control">
			<div class="input-group relative">
				<input
					name="search_query"
					bind:value={search_query}
					type="search"
					placeholder="Search channels"
					class="input input-bordered input-primary w-96" />
				<button class="btn btn-square">
					<IconSearch />
				</button>
			</div>
		</div>
	</form>

	{#if !searchPage}
		<div class="form-control">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<label
				for="create-channel-drawer"
				class="btn w-[21rem] btn-primary gap-2 drawer-button"
				on:click={() => {
					if ($current_user) {
						showDrawer = true
					} else {
						$is_login_modal_open = true
					}
				}}>
				<IconCreate />
				Create a channel</label>
		</div>
	{/if}

	{#if showDrawer && !searchPage}
		<CreateChannelDrawer bind:showDrawer />
	{/if}
</div>
