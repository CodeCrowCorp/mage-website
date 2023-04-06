<script lang="ts">
	import SubscriberItem from '$lib/components/Profile/Elements/SubscriberItem.svelte'
	import { subscriber_count, interest_count } from '$lib/stores/profileStore'

	export let subscribers: any, interests: any
</script>

<div class="flex flex-row justify-center gap-5 mt-8">
	{#await subscribers}
		Loading...
	{:then value}
		{#if value}
			<div class="flex flex-col w-2/4 gap-2 bg-blue-200 py-4 px-8">
				<p class="text-start text-black font-semibold">Subscribers ({$subscriber_count})</p>

				<div class="relative w-full">
					<input
						type="text"
						class="bg-gray-50 input input-primary text-sm rounded-lg  block w-full dark:text-white "
						placeholder="Search"
						required />
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
			<div class="flex flex-col w-2/4 gap-2 bg-pink-100 py-4 px-8">
				<p class="text-start text-black font-semibold">Interests ({$interest_count})</p>
				<div class="relative w-full">
					<input
						type="text"
						class="bg-gray-50 input input-primary text-sm rounded-lg  block w-full dark:text-white "
						placeholder="Search"
						required />
				</div>
				{#each value as subscriberItem}
					<SubscriberItem {subscriberItem} />
				{/each}
			</div>
		{/if}
	{/await}
</div>
