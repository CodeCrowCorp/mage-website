<script lang="ts">
	import IconDrawerApps from '$lib/assets/icons/drawer/IconDrawerApps.svelte'
	import IconDrawerStreak from '$lib/assets/icons/drawer/IconDrawerStreak.svelte'
	import IconDrawerStreamDuration from '$lib/assets/icons/drawer/IconDrawerStreamDuration.svelte'
	import IconDrawerHome from '$lib/assets/icons/drawer/IconDrawerHome.svelte'
	import IconDrawerVideos from '$lib/assets/icons/drawer/IconDrawerVideos.svelte'
	import IconDrawerCreatorSpace from '$lib/assets/icons/drawer/IconDrawerCreatorSpace.svelte'
	import IconDrawerSettings from '$lib/assets/icons/drawer/IconDrawerSettings.svelte'
	import IconDrawerLogOut from '$lib/assets/icons/drawer/IconDrawerLogOut.svelte'
	import IconSocialTwitter2 from '$lib/assets/icons/social/IconSocialTwitter2.svelte'
	import IconSocialDiscord from '$lib/assets/icons/social/IconSocialDiscord.svg'
	import IconSocialGitHub from '$lib/assets/icons/social/IconSocialGitHub.svelte'
	import IconDrawerAdmin from '$lib/assets/icons/drawer/IconDrawerAdmin.svelte'
	import IconDrawerMore from '$lib/assets/icons/drawer/IconDrawerMore.svelte'
	import IconDrawerBlog from '$lib/assets/icons/drawer/IconDrawerBlog.svelte'
	import { env } from '$env/dynamic/public'
	import { page } from '$app/stores'
	import { user_role } from '$lib/stores/userStore'
	import {
		is_feature_video_responses_enabled,
		is_feature_premium_enabled,
		is_feature_merch_enabled
	} from '$lib/stores/remoteConfigStore'
	import IconMageText from '$lib/assets/icons/IconMageText.svelte'
	import { is_apps_modal_open, is_login_modal_open } from '$lib/stores/helperStore'
	import { colorFromLevel, getNumberInThousands, levelAndBarValueFromExp } from '$lib/utils'
	import { onMount } from 'svelte'
	import { get } from '$lib/api'
	import IconMageLogo from '$lib/assets/icons/IconMageLogo.svelte'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import IconFollowers from '$lib/assets/icons/IconFollowers.svelte'
	import IconSocialYouTube from '$lib/assets/icons/social/IconSocialYouTube.svelte'
	import IconSocialTikTok from '$lib/assets/icons/social/IconSocialTikTok.svelte'
	import IconSocialTwitch from '$lib/assets/icons/social/IconSocialTwitch.svelte'
	import IconDrawerMerch from '$lib/assets/icons/drawer/IconDrawerMerch.svelte'
	import Avatar from '$lib/components/Global/Avatar.svelte'

	export var nav_drawer: HTMLInputElement

	$: currentUser = $page.data.user?.user

	let progressBarLevel = 1
	let progressBarValue = 0
	let progressBarColor = colorFromLevel(1)
	let currentStreakCount: any = 0
	let minsStreamed: number = 0
	let followers: number = 0
	onMount(async () => {
		if (currentUser) {
			let exp = currentUser.exp || 0
			let levelAndBarValue = levelAndBarValueFromExp(exp)
			progressBarLevel = levelAndBarValue.level
			progressBarValue = levelAndBarValue.barValue
			progressBarColor = colorFromLevel(progressBarLevel)
			currentStreakCount = await get(
				`analytics/stream/streak/current?userId=${$page.data.user?.userId}`
			)
			minsStreamed = await get(
				`analytics/stream/total-mins/24-hours?userId=${$page.data.user?.userId}`
			)
			followers = await get(`follows/count?source=${$page.data.user?.userId}&sourceType=source1`, {
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
					href="/{currentUser.username}"
					class="{isChannelPage ? 'justify-center md:w-full hero' : ''} rounded-md cursor-pointer">
					<div class={isChannelPage ? 'md:text-center' : ''}>
						<div class={isChannelPage ? '' : 'my-1'}>
							<div class="flex gap-3 {isChannelPage ? 'max-w-md' : 'max-w-full'}">
								<div
									class="avatar w-24 {isChannelPage ? 'md:w-12' : ''} mask {currentUser?.planTier >
									0
										? 'mask-hexagon'
										: 'mask-squircle'}">
									<Avatar
										avatar={currentUser.avatar}
										username={currentUser.username}
										className="w-24" />
								</div>
							</div>
						</div>
						<div class={isChannelPage ? 'md:hidden' : 'space-y-1'}>
							<div class="tooltip flex w-fit" data-tip={currentUser.displayName}>
								<p class="tooltip truncate">{currentUser.displayName}</p>
							</div>
							<div class="tooltip flex gap-1 w-fit" data-tip="@{currentUser.username}">
								<p class="truncate">@{currentUser.username}</p>
								{#if currentUser?.planTier > 0}
									<div class="text-accent font-bold">
										<IconDrawerVerification />
									</div>
								{/if}
							</div>
							<div class="flex gap-4 {isChannelPage ? 'md:hidden' : ''}">
								<div
									class="flex gap-1 tooltip tooltip-primary"
									data-tip="{currentStreakCount} day streak">
									<IconDrawerStreak />
									<p class="text-start">
										{currentStreakCount} d
									</p>
								</div>
								<div
									class="flex gap-1 tooltip tooltip-primary"
									data-tip="{getNumberInThousands(minsStreamed || 0)} mins streamed today">
									<IconDrawerStreamDuration />
									<p class="text-start">
										{getNumberInThousands(minsStreamed || 0)} m
									</p>
								</div>
								<div
									class="flex gap-1 tooltip tooltip-primary"
									data-tip="{getNumberInThousands(followers || 0)} followers">
									<IconFollowers />
									<p class="text-start">
										{getNumberInThousands(followers || 0)}
									</p>
								</div>
							</div>
						</div>
						<div class="tooltip tooltip-primary" data-tip="level {progressBarLevel}">
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
		{#if $is_feature_premium_enabled}
			<li>
				<a href="/premium" class="custom-menu-item text-accent hover:text-accent font-medium">
					<IconDrawerVerification />
					<span class={isChannelPage ? 'md:hidden' : ''}>Premium</span>
					{#if !isChannelPage}
						<span class="badge badge-accent text-accent-content">New</span>
					{/if}
				</a>
			</li>
		{/if}
		<li>
			<a class="custom-menu-item" href="https://blog.mage.stream" target="_blank">
				<IconDrawerBlog />
				<span class={isChannelPage ? 'md:hidden' : ''}>Blog </span>
			</a>
		</li>
		{#if $is_feature_merch_enabled}
			<li>
				<a class="custom-menu-item" href="https://blog.mage.stream" target="_blank">
					<IconDrawerMerch />
					<span class={isChannelPage ? 'md:hidden' : ''}>Merch </span>
					{#if !isChannelPage}
						<span class="badge badge-secondary text-secondary-content">New</span>
					{/if}
				</a>
			</li>
		{/if}
		<li>
			<a
				class="custom-menu-item whitespace-nowrap"
				on:click={() => {
					$is_apps_modal_open = true
					if (nav_drawer.checked) {
						nav_drawer.checked = false
					}
				}}>
				<IconDrawerApps />
				<span class={isChannelPage ? 'md:hidden' : ''}>Get apps</span>
				{#if !isChannelPage}
					<span class="badge badge-secondary">New</span>
				{/if}
			</a>
		</li>
		<li>
			<a class="custom-menu-item" href="/settings">
				<IconDrawerSettings />
				<span class={isChannelPage ? 'md:hidden' : ''}>Settings </span>
			</a>
		</li>
		<li>
			<details>
				<summary class="custom-menu-item"
					><IconDrawerMore />
					<span class={isChannelPage ? 'md:hidden' : ''}>More</span></summary>
				<ul class="p-2 {isChannelPage ? 'lg:menu-sm' : 'ml-5'}">
					<li>
						<a href="https://codecrow.io/careers" target="_blank">Careers</a>
					</li>
					<li>
						<a href="https://brand.mage.stream/IconMageLogo.zip" target="_blank">Brand</a>
					</li>
					<li><a href="https://codecrow.io/contact" target="_blank">Contact</a></li>
					<li><a href="https://codecrow.io/legal" target="_blank">Legal</a></li>
				</ul>
			</details>
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
			<a href="https://discord.mage.stream" target="_blank" rel="noreferrer">
				<img src={IconSocialDiscord} alt="discord icon" />
			</a>
			<a
				href="https://twitter.com/i/communities/1747324016921026613"
				target="_blank"
				rel="noreferrer">
				<IconSocialTwitter2 />
			</a>
			<a href="https://twitch.tv/gagansuie" target="_blank" rel="noreferrer">
				<IconSocialTwitch />
			</a>
			<a href="https://youtube.com/@gagansuie" target="_blank" rel="noreferrer">
				<IconSocialYouTube />
			</a>
			<a href="https://tiktok.com/@gagansuie" target="_blank" rel="noreferrer">
				<IconSocialTikTok />
			</a>
		</div>
		<p>
			<a href="https://codecrow.io" target="_blank" class="link link-hover"
				>Code Crow © {new Date().getFullYear()}</a>
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
