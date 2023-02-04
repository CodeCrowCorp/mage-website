<script lang="ts">
	import IconDrawerStreak from '$lib/assets/icons/drawer/IconDrawerStreak.svelte'
	import IconDrawerStreamDuration from '$lib/assets/icons/drawer/IconDrawerStreamDuration.svelte'
	import IconDrawerHome from '$lib/assets/icons/drawer/IconDrawerHome.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import IconDrawerMessages from '$lib/assets/icons/drawer/IconDrawerMessages.svelte'
	import IconDrawerVideos from '$lib/assets/icons/drawer/IconDrawerVideos.svelte'
	import IconDrawerCreatorSpace from '$lib/assets/icons/drawer/IconDrawerCreatorSpace.svelte'
	import IconDrawerMint from '$lib/assets/icons/drawer/IconDrawerMint.svelte'
	import IconDrawerPremium from '$lib/assets/icons/drawer/IconDrawerPremium.svelte'
	import IconDrawerCareers from '$lib/assets/icons/drawer/IconDrawerCareers.svelte'
	import IconDrawerHelpAndLegal from '$lib/assets/icons/drawer/IconDrawerHelpAndLegal.svelte'
	import IconDrawerSettings from '$lib/assets/icons/drawer/IconDrawerSettings.svelte'
	import IconDrawerLogOut from '$lib/assets/icons/drawer/IconDrawerLogOut.svelte'
	import IconSocialTwitter from '$lib/assets/icons/social/IconSocialTwitter.svelte'
	import IconSocialDiscord from '$lib/assets/icons/social/IconSocialDiscord.svg'
	import IconSocialDexlab from '$lib/assets/icons/social/IconSocialDexlab.svg'
	import IconSocialMagicEden from '$lib/assets/icons/social/IconSocialMagicEden.svg'
	import IconSocialGitHub from '$lib/assets/icons/social/IconSocialGitHub.svelte'
	import IconDrawerAdmin from '$lib/assets/icons/drawer/IconDrawerAdmin.svelte'
	import { goto } from '$app/navigation'
	import { env } from '$env/dynamic/public'
	import { current_user, user_role } from '$lib/stores/authStore'
	import {
		isFeatureMintPageEnabled,
		isFeaturePremiumPageEnabled,
		isFeatureGroupChatEnabled,
		isFeatureVideoResponsesEnabled
	} from '$lib/stores/remoteConfigStore'

	import { is_login_modal_open } from '$lib/stores/helperStore'
	import { colorFromLevel, levelAndBarValueFromExp } from '$lib/utils'

	export var nav_drawer: HTMLInputElement

	function logout() {
		setTimeout(() => {
			$current_user = null
		}, 500)
		goto('/logout')
	}

	let exp = 512 //Math.floor(Math.random() * (10000 - 0 + 1) + 0) //$current_user.exp
	let levelAndBarValue = levelAndBarValueFromExp(exp)
	let progressBarLevel = levelAndBarValue.level //levelFromExp(exp) //$current_user.exp
	let progressBarValue = levelAndBarValue.barValue //barValueFromExp(exp) //$current_user.exp
	let progressBarColor = colorFromLevel(progressBarLevel)
</script>

<div class="menu p-4 w-80 bg-base-100 text-base-content flex flex-col">
	<!-- <Messages /> -->
	<ul>
		<a href="/browse" class="btn btn-ghost normal-case text-xl">Mage</a>
		{#if $current_user}
			<li>
				<a href="/profile/me" class="hero rounded-md cursor-pointer">
					<div>
						<div class="hero-content">
							<div class="max-w-md">
								<div class="avatar online">
									<div
										class="w-24 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
										<img src={$current_user.avatar} alt="" />
									</div>
								</div>
							</div>
							<div class="grid grid-cols-3 gap-1">
								<p class="col-span-3">{$current_user.displayName}</p>
								<p class="col-span-3 text-pink-500 truncate">@{$current_user.username}</p>
								<IconDrawerStreak />
								<p class="col-span-2 tooltip text-start" data-tip="62 day streak">62 d</p>
								<IconDrawerStreamDuration />
								<p class="col-span-2 tooltip text-start" data-tip="300 hours streamed">300 h</p>
							</div>
						</div>
						<div class="tooltip" data-tip="level {progressBarLevel}">
							<progress
								class="progress w-64"
								style="--progress-bar-color: {progressBarColor}"
								value={progressBarValue}
								max="100" />
						</div>
					</div>
				</a>
			</li>
		{/if}
		<!-- Sidebar content here -->

		{#if $current_user && $user_role === 'admin'}
			<li>
				<a href="/admin">
					<IconDrawerAdmin />
					Admin
				</a>
			</li>
		{/if}
		<li>
			<a href="/browse">
				<IconDrawerHome />
				Browse
			</a>
		</li>
		{#if $current_user}
			<li>
				<a href="">
					<IconDrawerMessages />
					Messages
					<IconDrawerChevron />
				</a>
			</li>
		{/if}
		<!-- {#if $current_user && $isFeatureVideoResponsesEnabled}
			<li>
				<a href="/videos">
					<IconDrawerVideos />
					Videos
				</a>
			</li>
			<li>
				<a href="/creator-space">
					<IconDrawerCreatorSpace />
					Creator Space</a>
			</li>
		{/if}
		{#if $current_user && $isFeatureMintPageEnabled}
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
		{/if}
		{#if $current_user && $isFeaturePremiumPageEnabled}
			<li>
				<a href="/premium" class="text-pink-500">
					<IconDrawerPremium />
					Premium <span class="badge">New</span>
				</a>
			</li>
		{/if} -->
		<li>
			<a href="/careers">
				<IconDrawerCareers />
				Careers</a>
		</li>
		<li>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
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
		{#if $current_user}
			<li>
				<a href="/settings">
					<IconDrawerSettings />
					Settings</a>
			</li>
		{/if}
		{#if $current_user}
			<li>
				<button on:click={logout}>
					<IconDrawerLogOut />
					Log Out</button>
			</li>
		{:else}
			<li>
				<button
					on:click={() => {
						$is_login_modal_open = true
						if (nav_drawer.checked) {
							nav_drawer.checked = false
						}
					}}>
					<IconDrawerLogOut />
					Log In</button>
			</li>
		{/if}
	</ul>

	<footer class="mt-auto p-4">
		<!-- <RisingStars /> -->
		<div class="grid grid-flow-col gap-4">
			<a href="https://github.com/CodeCrowCorp" target="_blank" rel="noreferrer">
				<IconSocialGitHub />
			</a>
			<a href="https://discord.gg/CodeCrow" target="_blank" rel="noreferrer">
				<img src={IconSocialDiscord} alt="" />
			</a>
			<a href="https://twitter.com/CodeCrowCorp" target="_blank" rel="noreferrer">
				<IconSocialTwitter />
			</a>
			<a href="https://magiceden.io" target="_blank" rel="noreferrer">
				<img src={IconSocialMagicEden} alt="" />
			</a>
			<a href="https://www.dexlab.space" target="_blank" rel="noreferrer">
				<img src={IconSocialDexlab} alt="" />
			</a>
		</div>
		<p>Code Crow Corp © 2023</p>
		<p class="text-gray-500">v{__VERSION__} [{env.PUBLIC_ENV}]</p>
	</footer>
</div>

<style>
	progress::-webkit-progress-value {
		background-color: var(--progress-bar-color);
	}
</style>
