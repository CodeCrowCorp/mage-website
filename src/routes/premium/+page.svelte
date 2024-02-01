<script lang="ts">
	import ItemPlan from '$lib/components/Premium/ItemPlan.svelte'
	import LoadingItemPlan from '$lib/components/Premium/LoadingItemPlan.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	let recurringInterval: string = 'month',
		isChecked = false
	$: recurringInterval = isChecked ? 'year' : 'month'
</script>

<section>
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
			<h2 class="mb-4 text-4xl tracking-tight font-extrabold">Designed for dedicated streamers</h2>
			<p class="mb-5 font-light text-gray-500 sm:text-xl">
				Our platform is designed to expand your reach and grow your brand.
			</p>
			<div class="flex gap-2 justify-center">
				<span>Monthly</span>
				<input type="checkbox" class="toggle toggle-accent" bind:checked={isChecked} />
				<span>Yearly (2 months free)</span>
			</div>
		</div>
		<div class="md:flex h-full">
			{#await data.lazy.plans}
				<div class="w-full flex">
					{#each Array(3) as _, index (index)}
						<LoadingItemPlan />
					{/each}
				</div>
			{:then value}
				{#each value as plan, index}
					<ItemPlan {plan} {index} {recurringInterval} />
				{/each}
			{/await}
		</div>
	</div>
</section>
