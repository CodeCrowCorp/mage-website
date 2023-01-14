<script lang="ts">
	import '$lib/assets/styles/tailwind-output.css'
	// @ts-ignore
	import NProgress from 'nprogress'
	import { navigating } from '$app/stores'

	// NProgress Loading bar
	import 'nprogress/nprogress.css'
	import IconDrawerStreak from '$lib/assets/icons/drawer/IconDrawerStreak.svelte'
	import IconDrawerStreamDuration from '$lib/assets/icons/drawer/IconDrawerStreamDuration.svelte'
	import IconDrawerHome from '$lib/assets/icons/drawer/IconDrawerHome.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import IconDrawerCommunity from '$lib/assets/icons/drawer/IconDrawerCommunity.svelte'
	import IconDrawerMessages from '$lib/assets/icons/drawer/IconDrawerMessages.svelte'
	import IconDrawerVideos from '$lib/assets/icons/drawer/IconDrawerVideos.svelte'
	import IconDrawerCreatorSpace from '$lib/assets/icons/drawer/IconDrawerCreatorSpace.svelte'
	import IconDrawerMint from '$lib/assets/icons/drawer/IconDrawerMint.svelte'
	import IconDrawerPremium from '$lib/assets/icons/drawer/IconDrawerPremium.svelte'
	import IconDrawerCareers from '$lib/assets/icons/drawer/IconDrawerCareers.svelte'
	import IconDrawerHelpAndLegal from '$lib/assets/icons/drawer/IconDrawerHelpAndLegal.svelte'
	import IconDrawerSettings from '$lib/assets/icons/drawer/IconDrawerSettings.svelte'
	import IconDrawerLogOut from '$lib/assets/icons/drawer/IconDrawerLogOut.svelte'
	import IconSocialDexlab from '$lib/assets/icons/social/IconSocialDexlab.svelte'
	import IconSocialMagicEden from '$lib/assets/icons/social/IconSocialMagicEden.svelte'
	import IconSocialTwitter from '$lib/assets/icons/social/IconSocialTwitter.svelte'
	import IconSocialDiscord from '$lib/assets/icons/social/IconSocialDiscord.svelte'
	import IconSocialGitHub from '$lib/assets/icons/social/IconSocialGitHub.svelte'
	import IconDrawerAdmin from '$lib/assets/icons/drawer/IconDrawerAdmin.svelte'
	import LoginPrompt from '$lib/components/Browse/LoginPrompt.svelte'
	NProgress.configure({
		minimum: 0.75,
		showSpinner: false,
		speed: 5,
		trickleSpeed: 200
	})
	$: {
		if ($navigating) {
			NProgress.start()
		}
		if (!$navigating) {
			NProgress.done()
		}
	}

	export async function load({ page, session }: { page: any; session: any }) {
		//TODO: show or hide the drawer based on the session
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
		rel="stylesheet" />
</svelte:head>

<!-- {#if $isAuthenticated} -->
<div class="drawer drawer-mobile">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content bg-base-200">
		<!-- Page content here -->
		<label for="my-drawer-2" class="btn btn-ghost normal-case text-xl drawer-button lg:hidden"
			>Mage</label>
		<slot />
		<LoginPrompt />
	</div>
	<div class="drawer-side">
		<label for="my-drawer-2" class="drawer-overlay" />
		<div class="menu p-4 w-80 bg-base-100 text-base-content flex flex-col">
			<ul>
				<div class="navbar">
					<a href="/browse" class="btn btn-ghost normal-case text-xl">Mage</a>
				</div>
				<li>
					<a href="/profile/me" class="hero rounded-md cursor-pointer">
						<div>
							<div class="hero-content">
								<div class="max-w-md">
									<div class="avatar online">
										<div
											class="w-24 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
											<img src="https://placeimg.com/192/192/people" />
										</div>
									</div>
								</div>
								<div class="grid grid-cols-3 gap-1">
									<p class="col-span-3">Gagan Suie</p>
									<p class="col-span-3 text-pink-500">@GaganSuie</p>
									<IconDrawerStreak />
									<p class="col-span-2 tooltip text-start" data-tip="62 day streak">62 d</p>
									<IconDrawerStreamDuration />
									<p class="col-span-2 tooltip text-start" data-tip="300 hours streamed">300 h</p>
								</div>
							</div>
							<div class="tooltip" data-tip="level 1">
								<progress class="progress progress-accent w-64" value="30" max="100" />
							</div>
						</div>
					</a>
				</li>
				<!-- Sidebar content here -->
				<li>
					<a href="/admin">
						<IconDrawerAdmin />
						Admin
					</a>
				</li>
				<li>
					<a href="/browse">
						<IconDrawerHome />
						Browse
					</a>
				</li>
				<li>
					<a href="">
						<IconDrawerCommunity />
						Community
						<IconDrawerChevron />
					</a>
				</li>
				<li>
					<a href="">
						<IconDrawerMessages />
						Messages
						<IconDrawerChevron />
					</a>
				</li>
				<!-- <li>
					<a href="/videos">
						<IconDrawerVideos />
						Videos
					</a>
				</li>
				<li>
					<a href="/creator-space">
						<IconDrawerCreatorSpace />
						Creator Space</a>
				</li> -->
				<li>
					<a
						href="https://mint.codecrow.io"
						class="text-emerald-600"
						target="_blank"
						rel="noreferrer">
						<IconDrawerMint />
						Mint <span class="badge">New</span>
					</a>
				</li>
				<li>
					<a href="/premium" class="text-pink-500">
						<IconDrawerPremium />
						Premium <span class="badge">New</span>
					</a>
				</li>
				<li>
					<a href="/careers">
						<IconDrawerCareers />
						Careers</a>
				</li>
				<li>
					<div class="dropdown dropdown-bottom dropdown-end" tabindex="0">
						<IconDrawerHelpAndLegal />
						Help & Legal
						<IconDrawerChevron />
						<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
							<li><a href="/contact">Contact</a></li>
							<li><a href="/legal">Legal</a></li>
							<li>
								<a href="https://code-crow.gitbook.io/whitepaper/" target="_blank" rel="noreferrer"
									>White Paper</a>
							</li>
						</ul>
					</div>
				</li>
				<li>
					<a href="/settings">
						<IconDrawerSettings />
						Settings</a>
				</li>
				<li>
					<a href="#login-prompt-modal">
						<IconDrawerLogOut />
						Log Out</a>
				</li>
			</ul>
			<footer class="mt-auto p-4">
				<!-- <RisingStars /> -->
				<div class="grid grid-flow-col gap-4">
					<a href="https://github.com/CodeCrowCorp" target="_blank" rel="noreferrer">
						<IconSocialGitHub />
					</a>
					<a href="https://discord.gg/CodeCrow" target="_blank" rel="noreferrer">
						<IconSocialDiscord />
					</a>
					<a href="https://twitter.com/CodeCrowCorp" target="_blank" rel="noreferrer">
						<IconSocialTwitter />
					</a>
					<a href="https://magiceden.io" target="_blank" rel="noreferrer">
						<IconSocialMagicEden />
					</a>
					<a href="https://www.dexlab.space" target="_blank" rel="noreferrer">
						<IconSocialDexlab />
					</a>
				</div>
				<p>Code Crow Corp © 2023</p>
				<p class="text-gray-500">v0.0.1 [beta]</p>
			</footer>
		</div>
	</div>
</div>
<!-- {/if} -->

<!-- <style global>
	:root {
		--color-default: #ffffff;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--my-color: #25252a;
		}
	}
	[data-theme='dark'] {
		--color-default: #25252a;
	}
	[data-theme='light'] {
		--my-color: #ffffff;
	}
	body {
		background-color: var(--color-default);
	}
</style> -->
