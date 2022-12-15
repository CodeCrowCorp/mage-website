<script lang="ts">
	import SocialNav from '$lib/components/LandingPage/Nav/SocialNav/SocialNav.svelte';
	import Button from '$lib/components/LandingPage/Button/Button.svelte';
	import OutlineButton from '$lib/components/LandingPage/Button/OutlineButton.svelte';

	import rocketIcon from '$lib/assets/images/rocket.svg';
	import mintIcon from '$lib/assets/images/mint.svg';
</script>

<div>
	<div class="hidden items-center xl:flex space-x-6">
		<SocialNav />
		<OutlineButton
			title="Mint"
			titleColor="text-[#40B58A]"
			border="border-1 border-[#40B58A] hover:border-[#40B58A]"
			startIcon={mintIcon}
		/>
		<Button
			title="Launch Dapp"
			bgColor="bg-[#C8198B] hover:bg-[#C8198B]"
			border="border-1 border-[#C8198B] hover:border-[#C8198B]"
			startIcon={rocketIcon}
		/>
	</div>
	<div class="flex items-center space-x-1.5" />
</div>
