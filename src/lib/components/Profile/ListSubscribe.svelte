<script lang="ts">
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import SubscriberItem from '$lib/components/Profile/Elements/SubscriberItem.svelte'
	import { subscriber_count, interest_count } from '$lib/stores/profileStore'

	export let subscribers: any, interests: any

	let querySubscribe: string = '',
		queryInterest: string = ''
</script>

<div class="flex flex-row justify-center gap-5 mt-8">
	{#await subscribers}
		Loading...
	{:then value}
		{#if value}
			<div class="card flex flex-col w-2/4 gap-2 bg-base-200 py-4 px-8">
				<p class="text-start font-semibold">Subscribers ({$subscriber_count})</p>

				<div class="input-group relative">
					<input
						name="query"
						bind:value={querySubscribe}
						type="search"
						placeholder="Search subscribers"
						class="input input-bordered input-primary w-full" />
					<button class="btn btn-square">
						<IconSearch />
					</button>
				</div>

				{#each value as subscriberItem}
					<SubscriberItem {subscriberItem} />
				{/each}
			</div>
		{/if}
	{/await}
	{#await interests}
		Loading...
	{:then value}
		{#if value}
			<div class="card flex flex-col w-2/4 gap-2 bg-base-200 py-4 px-8">
				<p class="text-start font-semibold">Interests ({$interest_count})</p>
				<div class="input-group relative">
					<input
						name="query"
						bind:value={queryInterest}
						type="search"
						placeholder="Search interests"
						class="input input-bordered input-primary w-full" />
					<button class="btn btn-square">
						<IconSearch />
					</button>
				</div>

				{#each value as subscriberItem}
					<SubscriberItem {subscriberItem} />
				{/each}
			</div>
		{/if}
	{/await}
</div>
