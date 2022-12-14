<script lang="ts">
	import Benefit from '$lib/components/LandingPage/Utility/Benefit.svelte';

	import benefit1 from '$lib/assets/images/utility/nft-token-coin.svg';
	import benefit2 from '$lib/assets/images/utility/nft-reinvest.svg';
	import benefit3 from '$lib/assets/images/utility/nft-airdrop.svg';
	import benefit4 from '$lib/assets/images/utility/nft-features.svg';
	import benefit5 from '$lib/assets/images/utility/nft-special-borders.svg';

	const benefitList = [
		{
			name: 'Earn',
			image: benefit1,
			summary: 'Earn $RCR tokens for live-streaming'
		},
		{
			name: 'Reinvest',
			image: benefit2,
			summary: 'In-app profits will be reinvested into the liquidity pool'
		},
		{
			name: 'Airdrops',
			image: benefit3,
			summary: 'Select streamers and MVP Heroes NFT holders will receive $RCR Airdrops'
		},
		{
			name: 'New Features',
			image: benefit4,
			summary: 'Early access to new features and the mobile apps'
		},
		{
			name: 'Borders',
			image: benefit5,
			summary: 'Special borders around your avatar to flex your tier'
		}
	];
</script>

<div
	class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 divide-x divide-[#474747]"
>
	{#each benefitList as benefit}
		<Benefit name={benefit.name} image={benefit.image} summary={benefit.summary} />
	{/each}
</div>
