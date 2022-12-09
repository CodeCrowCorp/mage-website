<script lang="ts">
	import Logo from '$lib/components/LandingPage/Logo.svelte';
	import Nav from '$lib/components/LandingPage/Nav/Nav.svelte';
	/*import PrimeButton from '$lib/components/Button/PrimeButton.svelte';
	import AltButton from '$lib/components/Button/AltButton.svelte';
	import LinkButton from '$lib/components/Button/LinkButton.svelte';
	import MobileNavButton from '$lib/components/Button/MobileNavButton.svelte';
	import SearchBar from '$lib/components/Header/SearchBar.svelte';
	

	import ToggleColorButton from '$lib/components/Header/ToggleColorButton.svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const openMobileNav = () =>
		dispatch('open', { isOpenMobileNav: true, bodyStyle: 'overflow-hidden pr-3.5' });
	const toggleLightDarkMode = () => dispatch('toggle', { dark: 'dark' });*/
</script>

<!--
<div class="w-full ">
			<div
				class="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1"
			>
				<div class="hidden items-center xl:flex space-x-2">
					<ul class="hidden lg:flex lg:flex-wrap lg:items-center lg:space-x-1 relative">
						<li class="menu-item menu-dropdown relative">
							<LinkButton title="Discover" link="/" dropdown={true} />
						</li>
						<li class="menu-item">
							<LinkButton title="Help Center" link="/" />
						</li>
					</ul>
					<div class="hidden sm:block h-10 border-l border-neutral-300 dark:border-neutral-600" />
					<ToggleColorButton onClick={toggleLightDarkMode} />
					<PrimeButton title="Create" onClick={() => alert('Clicked!')} />
					<AltButton title="Connect Wallet" onClick />
				</div>
				<div class="flex items-center space-x-1.5 xl:hidden">
					<PrimeButton title="Create" onClick={() => alert('Clicked!')} />
					<MobileNavButton onClick={openMobileNav} />
				</div>
			</div>
		</div>
	</div>
</div>

<!-z-40 dark:bg-neutral-900/75 backdrop-blur bg-white/75-->
<div class="w-full top-0 left-0 pt-10">
	<div class="relative z-10">
		<div
			class="container relative flex justify-between items-center space-x-4 xl:space-x-8 mx-auto"
		>
			<div class="flex justify-start flex-grow items-center space-x-3 sm:space-x-8 lg:space-x-10">
				<Logo />
			</div>

			<div class="flex-shrink-0 flex items-center justify-end text-neutral-700 space-x-1">
				<Nav />
			</div>

			<!--
				<a matripple="" target="_blank" rel="noreferrer" class="btn-mint btn float-end"
					><img src="/assets/images/mint.svg" />MINT (SOON)
				</a><a matripple="" class="btn-dapp btn float-end"
					><img src="/assets/images/rocket.svg" />LAUNCH DAPP
				</a>
			</div>-->
		</div>
	</div>
</div>
