<script lang="ts">
	import SocialNavItem from '$lib/components/LandingPage/Nav/SocialNav/SocialNavItem.svelte';

	import github from '$lib/assets/images/github.svg';
	import discord from '$lib/assets/images/discord.svg';
	import twitter from '$lib/assets/images/twitter.svg';
	import magicEden from '$lib/assets/images/magiceden.svg';
	import dexlab from '$lib/assets/images/dexlab.svg';

	const socialLinks = [
		{ name: 'github', link: '/', image: github },
		{ name: 'discord', link: 'https://discord.com/invite/CodeCrow', image: discord },
		{ name: 'twitter', link: '/', image: twitter },
		{ name: 'magic-eden', link: '/', image: magicEden },
		{ name: 'dexlab', link: '/', image: dexlab }
	];
</script>

<ul class="hidden lg:flex lg:flex-wrap lg:items-center relative">
	{#each socialLinks as item}
		<SocialNavItem link={item.link} image={item.image} />
	{/each}
</ul>
