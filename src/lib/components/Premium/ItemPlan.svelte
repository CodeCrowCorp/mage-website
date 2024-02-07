<script lang="ts">
	import { page } from '$app/stores'
	import IconAffiliateCheck from '$lib/assets/icons/premium/IconAffiliateCheck.svelte'
	import { env } from '$env/dynamic/public'
	import { enhance } from '$app/forms'

	export let plan: any = {},
		index: number = 0,
		recurringInterval: string = 'month'

	let price: any

	$: if (recurringInterval) {
		price = plan.prices.find((price: any) => price.recurring.interval === recurringInterval)
	}
</script>

<div
	class="flex-1 mb-3 card max-w-sm flex flex-col p-6 mx-auto text-center xl:p-8 {index < 1
		? 'border border-gray-100 shadow dark:border-gray-600'
		: 'border border-gray-100 dark:border-gray-600 shadow-[0px_5px_50px_0px_rgba(100,10,100,1.3)]'}">
	{#if index > 0}
		<div class="bg-accent rounded-lg">
			<h3 class="text-2xl text-accent-content font-bold">
				{plan.name}
			</h3>
		</div>
	{:else}
		<h3 class="text-2xl {index > 0 ? 'text-accent font-bold' : 'font-semibold'}">
			{plan.name}
		</h3>
	{/if}
	<div class="flex justify-center items-baseline my-8">
		<span class="mr-2 text-5xl font-extrabold">${price?.unit_amount / 100}</span>
		<span class="text-gray-500">/{price?.recurring?.interval}</span>
	</div>
	<p class="sm:text-sm mb-8 font-semibold">
		{plan.description}
	</p>
	<ul class="mb-8 space-y-4 text-left">
		{#each plan.features as feature}
			<li class="flex items-center space-x-3">
				<IconAffiliateCheck />
				<span>{feature.name}</span>
			</li>
		{/each}
	</ul>
	{#if $page.data.user?.userId}
		<form
			class="mt-auto"
			method="post"
			use:enhance={({ formData }) => {
				formData.append('priceId', price.id)
			}}>
			<div class="flex flex-col space-y-3">
				{#if index > 0}
					<!-- !isOnboarded &&  <button
						class="btn btn-secondary btn-outline px-5 py-2.5 text-black"
						formaction="?/onboard">Onboard</button> -->
					<!-- {:else} -->
					{#if !plan.isSubscribed}
						<button
							class="btn btn-secondary px-5 py-2.5 text-secondary-content"
							formaction="?/subscribe">Subscribe</button>
					{:else}
						<a
							class="btn btn-accent px-5 py-2.5 text-accent-content"
							href={env.PUBLIC_STRIPE_BILLING_URL}>Dashboard</a>
					{/if}
				{/if}
			</div>
		</form>
	{/if}
</div>
