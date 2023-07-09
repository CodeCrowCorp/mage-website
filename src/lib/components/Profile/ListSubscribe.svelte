<script lang="ts">
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import SubscriberItem from '$lib/components/Profile/Elements/SubscriberItem.svelte'
	import { subscriber_count, interest_count } from '$lib/stores/profileStore'
	import { get } from '$lib/api.js'
	import { createEffect } from '$lib/utils'

	export let subscribers: any, interests: any
	export let profileId: string

	const useOueryEffect = createEffect();

	let querySubscribe: string = '',
		queryInterest: string = ''

	let skip = 100
	let limit = 100

	let searchedSubscribes: any = null
	let searchedInterests: any = null
	let loading1 = false, loading2 = false

	const searchSubscribers = async() => {
		loading1 = true
		searchedSubscribes = await get(`subscribes?source=${profileId}&sourceType=source1&searchQuery=${querySubscribe}&skip=${skip}&limit=${limit}`)
		loading1 = false
	}

	const searchInterests = async() => {
		loading2 = true
		searchedInterests = await get(`subscribes?source=${profileId}&sourceType=source2&searchQuery=${queryInterest}&skip=${skip}&limit=${limit}`)
		loading2 = false
	}

	$: useOueryEffect(() => {
		if(!querySubscribe){
			searchedSubscribes = null
		}
		if(!queryInterest){
			searchedInterests = null
		}
	}, [querySubscribe, queryInterest])


</script>

<div class="flex flex-row justify-center gap-5 mt-8">
	{#await subscribers}
		Loading...
	{:then value}
		{#if value}
			<div class="card flex flex-col w-1/2 gap-2 bg-base-200 py-4 px-8">
				<p class="text-start font-semibold">Subscribers ({$subscriber_count})</p>
					<div class="input-group relative">
						<input
							name="query"
							bind:value={querySubscribe}
							type="search"
							placeholder="Search subscribers"
							class="input input-bordered input-primary w-full" 
						/>
						<button on:click={searchSubscribers} class="btn btn-square btn-neutral text-white">
							<IconSearch />
						</button>
					</div>

					{#if loading1}
						<div>
							Loading...
						</div>
						{:else}
						{#each (searchedSubscribes || value) as subscriberItem}
							<SubscriberItem {subscriberItem} />
						{/each}
					{/if}
			</div>
		{/if}
	{/await}
	{#await interests}
		Loading...
	{:then value}
		{#if value}
			<div class="card flex flex-col w-1/2 gap-2 bg-base-200 py-4 px-8">
				<p class="text-start font-semibold">Interests ({$interest_count})</p>
					<div class="input-group relative">
						<input
							name="query"
							bind:value={queryInterest}
							type="search"
							placeholder="Search interests"
							class="input input-bordered input-primary w-full" />
						<button on:click={searchInterests}  class="btn btn-square btn-neutral text-white">
							<IconSearch />
						</button>
					</div>

				
				{#if loading2}
					<div>
						Loading...
					</div>
					{:else}
					{#each (searchedInterests || value) as subscriberItem}
						<SubscriberItem {subscriberItem} />
					{/each}
				{/if}
			</div>
		{/if}
	{/await}
</div>
