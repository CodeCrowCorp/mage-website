<script lang="ts">
	import { page } from '$app/stores'
	import IconAffiliateCheck from '$lib/assets/icons/affiliate/IconAffiliateCheck.svelte'
	import IconAffiliateVerification from '$lib/assets/icons/affiliate/IconAffiliateVerification.svelte'

	export let plan: any = {}
</script>

<div
	class="card max-w-sm flex flex-col p-6 mx-auto text-center border border-gray-100 shadow dark:border-gray-600 xl:p-8">
	<h3 class="text-2xl {plan.name === 'Affiliate' ? 'text-accent font-bold' : 'font-semibold'}">
		{plan.name}
	</h3>
	<!-- <p class=" text-gray-500 sm:text-lg">
		{plan.description}
	</p> -->
	<div class="flex justify-center items-baseline my-8">
		<span class="mr-2 text-5xl font-extrabold">${plan.price}</span>
		<span class="text-gray-500">/month</span>
	</div>
	<ul class="mb-8 space-y-4 text-left">
		{#each plan.features as feature}
			<li class="flex items-center space-x-3">
				<IconAffiliateCheck />
				<span>{feature}</span>
			</li>
		{/each}

		{#if plan.features2.length}
			<div class="divider text-accent font-bold">Requires Affiliate verification</div>
			{#each plan.features2 as feature}
				<li class="flex items-center space-x-3">
					<IconAffiliateVerification />
					<span>{feature}</span>
				</li>
			{/each}
		{/if}
	</ul>
	{#if $page.data.user?.userId}
		<form>
			<div class="flex flex-col space-y-3">
				{#if plan.name === 'Affiliate'}
					<button
						class="btn btn-accent px-5 py-2.5 text-black"
						disabled={$page.data.user?.user?.planDetails?.planTier > 0}
						>{$page.data.user?.user?.planDetails?.planTier > 0 ? 'Selected' : 'Select'}</button>
					{#if $page.data.user?.user?.planDetails?.planTier === 1}
						<a
							href="https://forms.gle/mBtByR6jdoJeQd367"
							class="link link-accent link-hover font-bold">
							Apply for verification
						</a>
					{/if}
				{:else}
					<button
						class="btn btn-neutral px-5 py-2.5"
						disabled={!$page.data.user?.user?.planDetails ||
							$page.data.user?.user?.planDetails?.planTier === 0}
						>{!$page.data.user?.user?.planDetails ||
						$page.data.user?.user?.planDetails?.planTier === 0
							? 'Selected'
							: 'Select'}</button>
				{/if}
			</div>
		</form>
	{/if}
</div>
