<script lang="ts">
	import '$lib/assets/styles/tailwind-output.css'
	import { category_list } from '$lib/stores/channelStore'
	import imageUrlsJson from '$lib/assets/svg-json/image_urls.json'

	// @ts-ignore
	import NProgress from 'nprogress'
	import { navigating } from '$app/stores'

	// NProgress Loading bar
	import '$lib/assets/styles/nprogress.css'
	import LoginPrompt from '$lib/components/MainDrawer/LoginPrompt.svelte'
	import DrawerMain from '$lib/components/MainDrawer/DrawerMain.svelte'
	import DrawerSmall from '$lib/components/MainDrawer/DrawerSmall.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { get } from '$lib/api'
	import { emitUserConnection, initPlatformSocket, platformSocket } from '$lib/websocket'
	import { platform_connection, platform_message } from '$lib/stores/websocketStore'
	import { isJsonString } from '$lib/utils'
	import IconMageText from '$lib/assets/icons/IconMageText.svg'
	import IconMageTextDark from '$lib/assets/icons/IconMageTextDark.svg'

	NProgress.configure({
		minimum: 0.75,
		showSpinner: false,
		speed: 5,
		trickleSpeed: 200
	})
	$: {
		if ($navigating) {
			NProgress.start()
		} else {
			NProgress.done()
		}
	}

	let nav_drawer: HTMLInputElement

	onMount(async () => {
		const platformSocketId = await get(`wsinit/wsid`)
		initPlatformSocket(platformSocketId)
		platformSocket.addEventListener('open', (data) => {
			console.log('socket connection open')
			console.log(data)
			platform_connection.set('open')
			if ($page.data.user?.userId)
				emitUserConnection({ userId: $page.data.user?.userId, isOnline: true })
		})
		platformSocket.addEventListener('message', (data) => {
			console.log('listening to messages')
			console.log(data.data)
			if (isJsonString(data.data)) platform_message.set(data.data)
		})
		platformSocket.addEventListener('error', (data) => {
			console.log('socket connection error')
			console.log(data)
		})
		platformSocket.addEventListener('close', (data) => {
			console.log('socket connection close')
			console.log(data)
			platform_connection.set('close')
		})

		if (!$category_list.length) {
			$category_list = imageUrlsJson
		}
	})
</script>

<svelte:head>
	<link rel="stylesheet" href="/fonts/montserrat.css" />
	{@html `<script> 
          const theme = localStorage.getItem('theme') || 'dark';
          document.querySelector('html').dataset.theme = theme;
        </script>`}
</svelte:head>

<div class="drawer drawer-mobile">
	<input id="main-drawer" bind:this={nav_drawer} type="checkbox" class="drawer-toggle" />
	<div class="drawer-content bg-base-200">
		<!-- Page content here -->
		<div class="menu w-fit">
			<ul>
				<li>
					<label for="main-drawer" class="lg:hidden rounded-lg">
						<img class="w-20 mage-text" src={IconMageText} alt="" />
						<img class="w-20 mage-text-dark" src={IconMageTextDark} alt="" />
					</label>
				</li>
			</ul>
		</div>

		{#if $page.data.user?.user?.isBanned}
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
		<label for="main-drawer" class="drawer-overlay" />
		{#if !$page.url.pathname.includes('/channel')}
			<DrawerMain bind:nav_drawer />
		{:else}
			<DrawerSmall bind:nav_drawer />
		{/if}
	</div>
</div>
