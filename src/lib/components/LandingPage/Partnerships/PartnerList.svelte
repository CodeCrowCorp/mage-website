<script lang="ts">
	import Partner from '$lib/components/LandingPage/Partnerships/Partner.svelte';

	import partner1 from '$lib/assets/images/partners/microsoft.png';
	import partner2 from '$lib/assets/images/partners/cloudflare.png';
	import partner3 from '$lib/assets/images/partners/digitalocean-hatch.png';
	import partner4 from '$lib/assets/images/partners/mongodb.png';
	import partner5 from '$lib/assets/images/partners/aws-activate.png';
	import partner6 from '$lib/assets/images/partners/twilio-startups.png';
	import partner7 from '$lib/assets/images/partners/scrimba.png';
	import partner8 from '$lib/assets/images/partners/coming-soon.png';

	const partnerList = [
		{ avatar: partner1, link: '/' },
		{ avatar: partner2, link: '/' },
		{ avatar: partner3, link: '/' },
		{ avatar: partner4, link: '/' },
		{ avatar: partner5, link: '/' },
		{ avatar: partner6, link: '/' },
		{ avatar: partner7, link: '/' },
		{ avatar: partner8, link: '/' }
	];
</script>

<div class="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
	{#each partnerList as partner}
		<Partner avatar={partner.avatar} link={partner.link} />
	{/each}
</div>
