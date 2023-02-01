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
	import { env } from '$env/dynamic/public'
	import { currentUser, userRole } from '$lib/stores/authStore'
	import {
		isFeatureMintPageEnabled,
		isFeaturePremiumPageEnabled,
		isFeatureGroupChatEnabled,
		isFeatureVideoResponsesEnabled
	} from '$lib/stores/remoteConfigStore'

	import { login_modal, colorFromLevel, levelAndBarValueFromExp } from '$lib/stores/helperStore'

	export let nav_drawer: HTMLInputElement

	function logout() {
		setTimeout(() => {
			$currentUser = null
		}, 500)
		goto('/logout')
	}

	let exp = 512 //Math.floor(Math.random() * (10000 - 0 + 1) + 0) //$currentUser.exp
	let levelAndBarValue = levelAndBarValueFromExp(exp)
	let progressBarLevel = levelAndBarValue.level //levelFromExp(exp) //$currentUser.exp
	let progressBarValue = levelAndBarValue.barValue //barValueFromExp(exp) //$currentUser.exp
	let progressBarColor = colorFromLevel(progressBarLevel)
</script>

<div class="menu p-4 bg-base-100 text-base-content flex flex-col">
	<!-- <Messages /> -->
	<ul>
		<a href="/browse" class="btn btn-ghost normal-case text-xl">Mage</a>
		{#if $currentUser}
			<li class="w-full">
				<a href="/profile/me" class="rounded-md cursor-pointer">
					<div>
						<div>
							<div class="avatar online">
								<div
									class="w-12 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
									<img src={$currentUser.avatar} alt="" />
								</div>
							</div>
						</div>
						<!-- <div class="grid grid-cols-1 gap-1">
							<p>{$currentUser.displayName || 'Gagan Suie'}</p>
							<p class="text-pink-500 w-12 truncate">
								@{$currentUser.username}
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

		{#if $currentUser && $userRole === 'admin'}
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
		{#if $currentUser}
			<li>
				<a href="">
					<IconDrawerMessages />
					<IconDrawerChevron />
				</a>
			</li>
		{/if}
		{#if $currentUser && $isFeatureVideoResponsesEnabled}
			<li>
				<a href="/videos">
					<IconDrawerVideos />
				</a>
			</li>
			<li>
				<a href="/creator-space"> <IconDrawerCreatorSpace /></a>
			</li>
		{/if}
		{#if $currentUser && $isFeatureMintPageEnabled}
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
		{#if $currentUser && $isFeaturePremiumPageEnabled}
			<li>
				<a href="/premium" class="text-pink-500">
					<IconDrawerPremium />
				</a>
			</li>
		{/if}
		<li>
			<a href="/careers"> <IconDrawerCareers /></a>
		</li>
		<li>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="dropdown dropdown-bottom dropdown-end" tabindex="0">
				<IconDrawerHelpAndLegal />
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
		{#if $currentUser}
			<li>
				<a href="/settings">
					<IconDrawerSettings />
				</a>
			</li>
		{/if}
		{#if $currentUser}
			<li>
				<button on:click={logout}>
					<IconDrawerLogOut />
				</button>
			</li>
		{:else}
			<li>
				<button
					on:click={() => {
						$login_modal = true
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
</style>
