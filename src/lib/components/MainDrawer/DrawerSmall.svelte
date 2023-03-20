<script lang="ts">
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
	import IconDrawerAdmin from '$lib/assets/icons/drawer/IconDrawerAdmin.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { user_role } from '$lib/stores/authStore'
	import {
		is_maintenance_mode_enabled,
		is_feature_mint_page_enabled,
		is_feature_premium_page_enabled,
		is_feature_group_chat_enabled,
		is_feature_video_responses_enabled
	} from '$lib/stores/remoteConfigStore'
	import IconMageLogo from '$lib/assets/icons/IconMageLogo.svg'
	import IconMageLogoDark from '$lib/assets/icons/IconMageLogoDark.svg'

	import { is_login_modal_open } from '$lib/stores/helperStore'
	import { colorFromLevel, levelAndBarValueFromExp } from '$lib/utils'

	export let nav_drawer: HTMLInputElement

	$: currentUser = $page.data.user?.user

	let exp = 512 //Math.floor(Math.random() * (10000 - 0 + 1) + 0) //currentUser.exp
	let levelAndBarValue = levelAndBarValueFromExp(exp)
	let progressBarLevel = levelAndBarValue.level //levelFromExp(exp) //currentUser.exp
	let progressBarValue = levelAndBarValue.barValue //barValueFromExp(exp) //currentUser.exp
	let progressBarColor = colorFromLevel(progressBarLevel)
</script>

<div class="menu p-4 w-80 md:w-32 bg-base-100 text-base-content flex flex-col">
	<!-- <MessagesDrawer /> -->
	<ul>
		<div class="menu">
			<ul>
				<li>
					<a href="/browse" class="justify-center">
						<img class="w-7 mage-logo" src={IconMageLogo} alt="" />
						<img class="w-7 mage-logo-dark" src={IconMageLogoDark} alt="" />
					</a>
				</li>
			</ul>
		</div>
		{#if currentUser}
			<li class="w-full">
				<a href="/profile/{currentUser.username}" class="rounded-md justify-center">
					<div>
						<div>
							<div class="avatar {currentUser.isOnline ? 'online' : 'offline'}">
								<div
									class="w-12 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
									<img src={currentUser.avatar} alt="" />
								</div>
							</div>
						</div>
						<!-- <div class="grid grid-cols-1 gap-1">
							<p>{currentUser.displayName || 'Gagan Suie'}</p>
							<p class="text-pink-500 w-12 truncate">
								@{currentUser.username}
							</p>
						</div> -->
						<div class="tooltip" data-tip="level {progressBarLevel}">
							<progress
								class="progress w-12"
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
				</a>
			</li>
		{/if}
		<li>
			<a href="/browse">
				<IconDrawerHome />
			</a>
		</li>
		<!-- {#if currentUser}
			<li>
				<a href="">
					<IconDrawerMessages />
					<IconDrawerChevron />
				</a>
			</li>
		{/if} -->
		<!-- {#if currentUser && $is_feature_video_responses_enabled}
			<li>
				<a href="/videos">
					<IconDrawerVideos />
				</a>
			</li>
			<li>
				<a href="/creator-space"> <IconDrawerCreatorSpace /></a>
			</li>
		{/if}
		{#if currentUser && $is_feature_mint_page_enabled}
			<li>
				<a
					href="https://mint.codecrow.io"
					class="text-emerald-600"
					target="_blank"
					rel="noreferrer">
					<IconDrawerMint />
				</a>
			</li>
		{/if}
		{#if currentUser && $is_feature_premium_page_enabled}
			<li>
				<a href="/premium" class="text-pink-500">
					<IconDrawerPremium />
				</a>
			</li>
		{/if} -->
		<li>
			<a href="/careers"> <IconDrawerCareers /></a>
		</li>
		<li>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="dropdown dropdown-bottom dropdown-end menu-item" tabindex="0">
				<IconDrawerHelpAndLegal />
				<!-- <IconDrawerChevron /> -->
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
					<li><a href="/contact">Contact</a></li>
					<li><a href="/legal">Legal</a></li>
				</ul>
			</div>
		</li>
		{#if currentUser}
			<li>
				<a href="/settings">
					<IconDrawerSettings />
				</a>
			</li>
		{/if}
		{#if currentUser}
			<form action="/logout" method="POST">
				<li>
					<button type="submit" class="menu-item"> <IconDrawerLogOut /></button>
				</li>
			</form>
		{:else}
			<li>
				<button
					class="menu-item"
					on:click={() => {
						$is_login_modal_open = true
						if (nav_drawer.checked) {
							nav_drawer.checked = false
						}
					}}>
					<IconDrawerLogOut />
				</button>
			</li>
		{/if}
	</ul>
</div>

<style>
	progress::-webkit-progress-value {
		background-color: var(--progress-bar-color);
	}

	:global(html[data-theme='dark'] .mage-logo) {
		display: none;
	}

	:global(html[data-theme='light'] .mage-logo-dark) {
		display: none;
	}

	a,
	.menu-item {
		justify-content: center;
	}
</style>
