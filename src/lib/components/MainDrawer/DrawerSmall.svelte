<script lang="ts">
	import IconDrawerStreak from '$lib/assets/icons/drawer/IconDrawerStreak.svelte'
	import IconDrawerStreamDuration from '$lib/assets/icons/drawer/IconDrawerStreamDuration.svelte'
	import IconDrawerHome from '$lib/assets/icons/drawer/IconDrawerHome.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import IconDrawerCareers from '$lib/assets/icons/drawer/IconDrawerCareers.svelte'
	import IconDrawerHelpAndLegal from '$lib/assets/icons/drawer/IconDrawerHelpAndLegal.svelte'
	import IconDrawerSettings from '$lib/assets/icons/drawer/IconDrawerSettings.svelte'
	import IconDrawerLogOut from '$lib/assets/icons/drawer/IconDrawerLogOut.svelte'
	import IconSocialTwitter from '$lib/assets/icons/social/IconSocialTwitter.svelte'
	import IconSocialDiscord from '$lib/assets/icons/social/IconSocialDiscord.svg'
	import IconSocialGitHub from '$lib/assets/icons/social/IconSocialGitHub.svelte'
	import IconDrawerAdmin from '$lib/assets/icons/drawer/IconDrawerAdmin.svelte'
	import { env } from '$env/dynamic/public'
	import { page } from '$app/stores'
	import { user_role } from '$lib/stores/authStore'
	import IconMageLogo from '$lib/assets/icons/IconMageLogo.svelte'
	import IconMageText from '$lib/assets/icons/IconMageText.svelte'

	import { is_login_modal_open } from '$lib/stores/helperStore'
	import { colorFromLevel, levelAndBarValueFromExp } from '$lib/utils'
	import { onMount } from 'svelte'
	import { isOnline } from '$lib/stores/userStore'
	import { get } from '$lib/api'
	import IconDrawerPremium from '$lib/assets/icons/drawer/IconDrawerPremium.svelte'
	import { is_feature_premium_page_enabled } from '$lib/stores/remoteConfigStore'

	export var nav_drawer: HTMLInputElement

	$: currentUser = $page.data.user?.user

	let progressBarLevel = 1
	let progressBarValue = 0
	let progressBarColor = colorFromLevel(1)
	let streakCount = 0
	let hoursStreamed = 0
	onMount(async () => {
		if (currentUser) {
			let exp = currentUser.exp || 0
			let levelAndBarValue = levelAndBarValueFromExp(exp)
			progressBarLevel = levelAndBarValue.level
			progressBarValue = levelAndBarValue.barValue
			progressBarColor = colorFromLevel(progressBarLevel)
			streakCount = await get(`stats/stream/streak`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
			hoursStreamed = await get(`stats/stream/total-hours`, {
				userId: $page.data.user?.userId,
				token: $page.data.user?.token
			})
		}
	})
</script>

<div class="menu w-80 md:w-24 bg-base-100 text-base-content flex flex-col fixed h-full">
	<ul class="md:flex md:flex-col items-center md:w-full">
		<div class="menu w-full">
			<ul>
				<li>
					<a href="/browse" class="md:justify-center">
						<IconMageLogo customClass={'w-20 md:w-7 mage-text hidden md:block'} />
						<IconMageText customClass={'w-20 md:w-7 mage-text md:hidden'} />
					</a>
				</li>
			</ul>
		</div>
		{#if currentUser}
			<li class="md:w-full">
				<a
					href="/profile/{currentUser.username}"
					class="rounded-md justify-center cursor-pointer md:w-full">
					<div class="md:text-center">
						<div class="hero-content">
							<div class="max-w-md">
								<div class="avatar {$isOnline ? 'online' : 'offline'}">
									<div
										class="w-24 md:w-12 mask {currentUser.isPaidPlan
											? 'mask-hexagon'
											: 'mask-squircle'}">
										<img src={currentUser.avatar} alt="" />
									</div>
								</div>
							</div>
							<div class="grid grid-cols-3 gap-1 md:hidden">
								<div class="col-span-3 tooltip flex" data-tip={currentUser.displayName}>
									<p class="truncate">{currentUser.displayName}</p>
								</div>
								<div class="col-span-3 tooltip flex" data-tip="@{currentUser.username}">
									<p class=" text-pink-500 truncate">@{currentUser.username}</p>
								</div>
								<IconDrawerStreak />
								<p class="col-span-2 tooltip text-start" data-tip="{streakCount} day streak">
									{streakCount} d
								</p>
								<IconDrawerStreamDuration />
								<p
									class="col-span-2 tooltip text-start"
									data-tip="{hoursStreamed} hours streamed today">
									{hoursStreamed} h
								</p>
							</div>
						</div>
						<div class="tooltip" data-tip="level {progressBarLevel}">
							<progress
								class="progress w-64 md:w-12"
								style="--progress-bar-color: {progressBarColor}"
								value={progressBarValue}
								max="100" />
						</div>
					</div>
				</a>
			</li>
		{/if}

		{#if currentUser && $user_role === 'admin'}
			<li>
				<a href="/admin">
					<IconDrawerAdmin />
					<span class="md:hidden">Admin</span>
				</a>
			</li>
		{/if}
		<li>
			<a href="/browse">
				<IconDrawerHome />
				<span class="md:hidden">Browse</span>
			</a>
		</li>
		{#if currentUser && $is_feature_premium_page_enabled}
			<li>
				<a href="/premium" class="text-accent hover:text-accent">
					<IconDrawerPremium />
					<span class="md:hidden">Premium</span>
				</a>
			</li>
		{/if}
		<li>
			<a href="/careers">
				<IconDrawerCareers />
				<span class="md:hidden"> Careers </span>
			</a>
		</li>
		<li>
			<div class="dropdown dropdown-bottom" tabindex="-1">
				<IconDrawerHelpAndLegal />

				<span class="md:hidden flex flex-row gap-4">
					Help & Legal
					<IconDrawerChevron /></span>
				<ul
					tabindex="-1"
					class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 z-10">
					<li><a href="/contact">Contact</a></li>
					<li><a href="/legal">Legal</a></li>
				</ul>
			</div>
		</li>
		<li>
			<a href="/settings">
				<IconDrawerSettings />
				<span class="md:hidden"> Settings </span>
			</a>
		</li>
		{#if currentUser}
			<li>
				<form action="/logout" method="POST">
					<button type="submit">
						<IconDrawerLogOut />
						<span class="md:hidden">Log out </span>
					</button>
				</form>
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
					<span class="md:hidden">Log In </span>
				</button>
			</li>
		{/if}
	</ul>

	<footer class="mt-auto p-4 md:hidden">
		<div class="flex gap-4">
			<a href="https://github.com/CodeCrowCorp" target="_blank" rel="noreferrer">
				<IconSocialGitHub />
			</a>
			<a href="https://discord.gg/CodeCrow" target="_blank" rel="noreferrer">
				<img src={IconSocialDiscord} alt="" />
			</a>
			<a href="https://twitter.com/CodeCrowCorp" target="_blank" rel="noreferrer">
				<IconSocialTwitter />
			</a>
		</div>
		<p>Code Corp © 2023</p>
		<p class="text-gray-500">v{__VERSION__} [{env.PUBLIC_ENV}]</p>
	</footer>
</div>

<style>
	progress::-webkit-progress-value {
		background-color: var(--progress-bar-color);
	}
</style>
