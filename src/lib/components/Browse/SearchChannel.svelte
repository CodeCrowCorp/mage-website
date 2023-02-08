<script lang="ts">
	import IconCreate from '$lib/assets/icons/IconCreate.svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import CreateChannelDrawer from './CreateChannelDrawer.svelte'
	import { current_user } from '$lib/stores/authStore'

	export let searchPage = false
	export let search_query = ''
	export let isDisabled = !current_user

	let showDrawer = false
</script>

<div class="flex flex-col md:flex-row gap-4 py-5 pl-5 {searchPage ? 'px-4 md:px-24' : ''}">
	<form class={searchPage ? 'flex-1' : ''} method="GET" action={`/search`}>
		<div class="form-control">
			<div class="input-group relative">
				<input
					name="search_query"
					bind:value={search_query}
					type="text"
					placeholder="Search channels"
					class="input input-bordered input-primary {searchPage ? 'w-full' : 'w-72'}" />
				{#if search_query && search_query.length}
					<button
						class="btn btn-ghost absolute right-10"
						on:click={async (e) => {
							e.preventDefault()
							search_query = ''
						}}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
				{/if}
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
			class="btn w-[21rem] btn-primary gap-2 drawer-button"
			on:click={() => (showDrawer = true)}
			{...isDisabled ? { disabled: '' } : {}}>
			<IconCreate />
			Create a channel</label>
	</div>

	{#if showDrawer}
		<CreateChannelDrawer bind:showDrawer />
	{/if}
</div>
