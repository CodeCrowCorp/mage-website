<script async script lang="ts">
	import '$lib/assets/styles/tailwind-output.css'
	// @ts-ignore
	import NProgress from 'nprogress'
	import { browser } from '$app/environment'
	import { navigating } from '$app/stores'
	import { current_user, user_role } from '$lib/stores/authStore'
	import { getPlatformSocket } from '$lib/stores/socketStore'

	// NProgress Loading bar
	import 'nprogress/nprogress.css'
	import LoginPrompt from '$lib/components/MainDrawer/LoginPrompt.svelte'
	import Messages from '$lib/components/MainDrawer/Messages.svelte'
	import MainDrawer from '$lib/components/MainDrawer/MainDrawer.svelte'
	import SmallDrawer from '$lib/components/MainDrawer/SmallDrawer.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

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
			storeUserData()
			NProgress.done()
		}
	}

	export let data: any

	let nav_drawer: HTMLInputElement

	function storeUserData() {
		if (browser) {
			if (data?.user?.user) {
				$current_user = data.user.user
			} else {
				$current_user = null
			}
		}
	}

	onMount(async () => {
		// await getPlatformSocket()
	})
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
		rel="stylesheet" />
</svelte:head>

<div class="drawer drawer-mobile">
	<input id="my-drawer-2" bind:this={nav_drawer} type="checkbox" class="drawer-toggle" />
	<div class="drawer-content bg-base-200">
		<!-- Page content here -->
		<label for="my-drawer-2" class="btn btn-ghost normal-case text-xl drawer-button lg:hidden"
			>Mage</label>

		{#if data && data.isBanned}
			<div class="alert alert-error shadow-lg">
				<div>
					<div class="font-bold text-white">
						<h3>Your account is banned</h3>
					</div>
				</div>
			</div>
		{/if}

		<slot />
		<LoginPrompt />
	</div>
	<div class="drawer-side">
		<label for="my-drawer-2" class="drawer-overlay" />
		{#if !$page.url.pathname.includes('/channel')}
			<MainDrawer bind:nav_drawer />
		{:else}
			<SmallDrawer bind:nav_drawer />
		{/if}
	</div>
</div>
