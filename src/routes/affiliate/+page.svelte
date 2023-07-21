<script lang="ts">
	import ItemPlan from '$lib/components/Affiliate/ItemPlan.svelte'
	import { onMount } from 'svelte'

	let plans: any = [
		{
			name: 'Free',
			// description:
			// 	'Great for individuals just getting started with streaming and learning the platform.',
			price: 0,
			features: [
				'Unlimited channels',
				'Up to 9 guests in a live-stream',
				'AI chat fully enabled',
				'Up to 100 messages in chat history',
				'Record and view streaming stats'
			],
			features2: []
		},
		{
			name: 'Affiliate',
			// description:
			// 	'Perfect for dedicated streamers looking to grow their brand and expand their reach.',
			price: 4,
			features: [
				'Everything in Free Tier',
				'Expanded reach for brand growth',
				'GPT-4 access (once available)',
				'Unlimited chat history',
				'Dedicated support'
			],
			features2: ['An affiliate badge', 'Modified avatar', 'Sponsor contributions (once available)']
		}
	]

	onMount(() => {})
</script>

<section>
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
			<h2 class="mb-4 text-4xl tracking-tight font-extrabold">Designed for dedicated streamers</h2>
			<p class="mb-5 font-light text-gray-500 sm:text-xl">
				Collaborative streaming powered by AI. Our platform is designed to expand your reach and
				grow your brand.
			</p>
		</div>
		<div class="md:flex md:space-y-5">
			{#each plans as plan}
				<ItemPlan {plan} />
			{/each}
		</div>
	</div>
</section>
