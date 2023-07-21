<script lang="ts">
	import IconDrawerStreak from '$lib/assets/icons/drawer/IconDrawerStreak.svelte'
	import IconDrawerStreamDuration from '$lib/assets/icons/drawer/IconDrawerStreamDuration.svelte'
	import IconDrawerHome from '$lib/assets/icons/drawer/IconDrawerHome.svelte'
	import IconDrawerVideos from '$lib/assets/icons/drawer/IconDrawerVideos.svelte'
	import IconDrawerCreatorSpace from '$lib/assets/icons/drawer/IconDrawerCreatorSpace.svelte'
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
	import {
		is_feature_video_responses_enabled,
		is_feature_affiliate_enabled
	} from '$lib/stores/remoteConfigStore'
	import IconMageText from '$lib/assets/icons/IconMageText.svelte'
	import { is_login_modal_open } from '$lib/stores/helperStore'
	import { colorFromLevel, levelAndBarValueFromExp } from '$lib/utils'
	import { onMount } from 'svelte'
	import { isOnline } from '$lib/stores/userStore'
	import { get } from '$lib/api'
	import IconMageLogo from '$lib/assets/icons/IconMageLogo.svelte'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'

	export var nav_drawer: HTMLInputElement

	$: currentUser = $page.data.user?.user

	let progressBarLevel = 1
	let progressBarValue = 0
	let progressBarColor = colorFromLevel(1)
	let streakCount: number = 0
	let hoursStreamed: number = 0
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
	let isChannelPage = false
	$: isChannelPage = $page.url.pathname.includes('/channel')
</script>

<div
	class="menu w-80 overflow-y-auto overflow-x-hidden flex-nowrap {isChannelPage
		? 'md:w-24 fixed h-full'
		: 'h-screen'} bg-base-100 text-base-content flex flex-col">
	<ul class={isChannelPage ? 'md:flex md:flex-col items-center md:w-full' : ''}>
		<div class={isChannelPage ? 'menu w-full' : 'w-fit mb-1'}>
			<ul>
				<li>
					<a href="/browse" class={isChannelPage ? 'md:justify-center' : ''}>
						{#if isChannelPage}
							<IconMageLogo customClass={'w-20 md:w-7 mage-text hidden md:block'} />
							<IconMageText customClass={'w-20 md:w-7 mage-text md:hidden'} />
						{:else}
							<IconMageText />
						{/if}
					</a>
				</li>
			</ul>
		</div>
		{#if currentUser}
			<li class={isChannelPage ? 'md:w-full' : ''}>
				<a
					href="/profile/{currentUser.username}"
					class="{isChannelPage ? 'justify-center md:w-full hero' : ''} rounded-md cursor-pointer">
					<div class={isChannelPage ? 'md:text-center' : ''}>
						<div class={isChannelPage ? '' : 'my-1'}>
							<div class="flex gap-3 {isChannelPage ? 'max-w-md' : 'max-w-full'}">
								<div class="avatar {$isOnline ? 'online' : 'offline'}">
									<div
										class="w-24 {isChannelPage ? 'md:w-12' : ''} mask {currentUser?.affiliateTier >
										1
											? 'mask-hexagon'
											: 'mask-squircle'}">
										<img src={currentUser.avatar} alt="" />
									</div>
								</div>
							</div>
						</div>
						<div class={isChannelPage ? 'md:hidden' : 'space-y-1'}>
							<div class="tooltip flex w-fit" data-tip={currentUser.displayName}>
								<p class="tooltip truncate">{currentUser.displayName}</p>
							</div>
							<div class="tooltip flex gap-1 w-fit" data-tip="@{currentUser.username}">
								<p class="truncate">@{currentUser.username}</p>
								{#if currentUser.isAffiliate}
									<div class="text-accent font-bold">
										<IconDrawerVerification />
									</div>
								{/if}
							</div>
							<div class="flex gap-4 {isChannelPage ? 'md:hidden' : ''}">
								<div class="flex gap-1 tooltip" data-tip="{streakCount} day streak">
									<IconDrawerStreak />
									<p class="text-start">
										{streakCount} d
									</p>
								</div>
								<div class="flex gap-1 tooltip" data-tip="{hoursStreamed} hours streamed today">
									<IconDrawerStreamDuration />
									<p class="text-start">
										{hoursStreamed} h
									</p>
								</div>
							</div>
						</div>
						<div class="tooltip" data-tip="level {progressBarLevel}">
							<progress
								class="tooltip progress w-[17rem] mt-3 {isChannelPage ? 'md:w-12' : ''}"
								style="--progress-bar-color: {progressBarColor}"
								value={progressBarValue}
								max="100" />
						</div>
					</div>
				</a>
			</li>
		{/if}
		<!-- Sidebar content here -->

		{#if currentUser && $user_role === 'admin'}
			<li>
				<a href="/admin">
					<IconDrawerAdmin />
					<span class={isChannelPage ? 'md:hidden' : ''}>Admin</span>
				</a>
			</li>
		{/if}
		<li>
			<a class="custom-menu-item" href="/browse">
				<IconDrawerHome />
				<span class={isChannelPage ? 'md:hidden' : ''}>Browse</span>
			</a>
		</li>
		{#if currentUser && $is_feature_video_responses_enabled}
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
		{#if currentUser && $is_feature_affiliate_enabled}
			<li>
				<a href="/affiliate" class="custom-menu-item text-accent hover:text-accent font-medium">
					<IconDrawerVerification />
					<span class={isChannelPage ? 'md:hidden' : ''}>Affiliate</span>
					{#if !isChannelPage}
						<span class="badge badge-accent text-black">New</span>
					{/if}
				</a>
			</li>
		{/if}
		<li>
			<a class="custom-menu-item" href="https://codecrow.io/careers" target="_blank">
				<IconDrawerCareers />
				<span class={isChannelPage ? 'md:hidden' : ''}>Careers</span>
			</a>
		</li>
		<li>
			<details>
				<summary class="custom-menu-item"
					><IconDrawerHelpAndLegal />
					<span class={isChannelPage ? 'md:hidden' : ''}>Help & Legal</span></summary>
				<ul class="p-2 {isChannelPage ? 'lg:menu-sm' : 'ml-5'}">
					<li><a href="https://codecrow.io/contact" target="_blank">Contact</a></li>
					<li><a href="https://codecrow.io/legal" target="_blank">Legal</a></li>
				</ul>
			</details>
		</li>
		<li>
			<a class="custom-menu-item" href="/settings">
				<IconDrawerSettings />
				<span class={isChannelPage ? 'md:hidden' : ''}>Settings </span>
			</a>
		</li>
		{#if currentUser}
			<form action="/logout" method="POST">
				<li>
					<button class="custom-menu-item" type="submit">
						<IconDrawerLogOut />
						<span class={isChannelPage ? 'md:hidden' : ''}>Log out</span>
					</button>
				</li>
			</form>
		{:else}
			<li>
				<button
					class="custom-menu-item"
					on:click={() => {
						$is_login_modal_open = true
						if (nav_drawer.checked) {
							nav_drawer.checked = false
						}
					}}>
					<IconDrawerLogOut />
					<span class={isChannelPage ? 'md:hidden' : ''}>Log In</span>
				</button>
			</li>
		{/if}
	</ul>

	<footer class="mt-auto p-6 py-5 {isChannelPage ? 'md:hidden' : ''}">
		<div class="flex gap-4 items-center">
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
		<p>
			<a href="https://codecrow.io" target="_blank" class="link link-hover">Code Crow © 2023</a>
		</p>
		<p class="text-gray-500">
			v{__VERSION__} [{env.PUBLIC_ENV === 'production' ? 'beta' : env.PUBLIC_ENV}]
		</p>
	</footer>
</div>

<style>
	progress::-webkit-progress-value {
		background-color: var(--progress-bar-color);
	}
	.custom-menu-item {
		gap: 0.75rem;
		padding: 0.75rem 1rem;
	}
	.menu {
		font-size: initial;
		line-height: inherit;
	}
</style>
