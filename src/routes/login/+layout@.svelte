<script>
	import Header from '$lib/components/LandingPage/Header.svelte';
	import Footer from '$lib/components/LandingPage/Footer.svelte';
</script>

<div class="text-base">
	<Header />
	<!--<div class="fixed w-full z-40 dark:bg-neutral-900/75 backdrop-blur bg-white/75">
		<div class="relative z-10">
			<div class="container py-4 relative flex justify-between items-center space-x-4 xl:space-x-8">
				<div class="flex justify-start flex-grow items-center space-x-3 sm:space-x-8 lg:space-x-10">
					<!-Logo
				</div>
				<div
					class="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1"
				>
					<div class="hidden items-center xl:flex space-x-2">
						<ul class="hidden lg:flex lg:flex-wrap lg:items-center lg:space-x-1 relative">
							<li class="menu-item menu-dropdown relative">
								<!-<LinkButton title="Discover" link="/" dropdown={true} />>
							</li>
							<!<li class="menu-item">
							<LinkButton title="Help Center" link="/" />
						</li>>
						</ul>
						<div class="hidden sm:block h-10 border-l border-neutral-300 dark:border-neutral-600" />
						<!-<ToggleColorButton onClick={toggleLightDarkMode} />
						<PrimeButton title="Create" onClick={() => alert('Clicked!')} />
						<AltButton title="Connect Wallet" onClick />->
					</div>
					<div class="flex items-center space-x-1.5 xl:hidden">
						<!-<PrimeButton title="Create" onClick={() => alert('Clicked!')} />
						<MobileNavButton onClick={openMobileNav} />->
					</div>
				</div>
			</div>
		</div>
	</div>-->

	<slot />

	<Footer />
</div>
