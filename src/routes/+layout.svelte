<script lang="ts">
	import '$lib/assets/styles/tailwind-output.css'
	import { category_list } from '$lib/stores/channelStore'
	import imageUrlsJson from '$lib/assets/svg-json/image_urls.json'

	// @ts-ignore
	import NProgress from 'nprogress'
	import { page, navigating } from '$app/stores'

	// NProgress Loading bar
	import '$lib/assets/styles/nprogress.css'
	import LoginPrompt from '$lib/components/Global/LoginPrompt.svelte'
	import DrawerMain from '$lib/components/Global/DrawerMain.svelte'
	import { onMount } from 'svelte'
	import { get, put } from '$lib/api'
	import { emitUserConnection, initPlatformSocket, platformSocket } from '$lib/websocket'
	import { platform_connection, platform_message } from '$lib/stores/websocketStore'
	import { isJsonString } from '$lib/utils'
	import IconMageText from '$lib/assets/icons/IconMageText.svelte'
	import { isOnline } from '$lib/stores/userStore'
	import { current_theme } from '$lib/stores/helperStore'
	import {
		is_feature_video_responses_enabled,
		is_feature_premium_enabled,
		is_feature_apps_enabled,
		is_feature_studio_mode_enabled
	} from '$lib/stores/remoteConfigStore'
	import { env } from '$env/dynamic/public'
	import { user_role } from '$lib/stores/userStore'
	import MobileAppsPrompt from '$lib/components/Global/MobileAppsPrompt.svelte'

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
		$current_theme = localStorage.getItem('theme') || 'dark'
		$is_feature_video_responses_enabled = env.PUBLIC_FEATURE_VIDEO_RESPONSES === 'true'
		$is_feature_premium_enabled = env.PUBLIC_FEATURE_PREMIUM === 'true'
		$is_feature_apps_enabled = env.PUBLIC_FEATURE_APPS === 'true'
		$is_feature_studio_mode_enabled = env.PUBLIC_FEATURE_STUDIO_MODE === 'true'
		await handleWebsocket()
		if (!$category_list.length) {
			$category_list = imageUrlsJson
		}
		getUserRole()
	})

	const getUserRole = async () => {
		//TODO: get role from Auth0
		$user_role = 'user'
	}

	const handleWebsocket = async () => {
		try {
			if ($page.data.user?.userId) {
				const platformSocketId = await get(`wsinit/wsid`)
				initPlatformSocket({ websocketId: platformSocketId })
				platformSocket.addEventListener('open', (data) => {
					console.log('socket connection open')
					console.log(data)
					$platform_connection = 'open'
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
					$platform_connection = 'close'
					attemptReconnect()
				})
			}
		} catch (error) {
			attemptReconnect()
		}
	}

	const attemptReconnect = () => {
		setTimeout(async () => {
			console.log('Reconnecting to WebSocket...')
			await handleWebsocket()
		}, 4000)
	}

	platform_connection.subscribe(async (value: any) => {
		if (!value) return
		$isOnline = value === 'open'
		if ($page.data.user?.userId && value === 'open') {
			emitUserConnection({ userId: $page.data.user?.userId, isOnline: $isOnline })
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

<div class="drawer lg:drawer-open">
	<input id="main-drawer" bind:this={nav_drawer} type="checkbox" class="drawer-toggle" />
	<div class="drawer-content bg-base-200 h-screen overflow-y-auto">
		<!-- Page content here -->
		<label for="main-drawer" class="menu w-fit lg:hidden rounded-lg m-2">
			<IconMageText />
		</label>

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
		{#if $is_feature_apps_enabled}
			<MobileAppsPrompt />
		{/if}
	</div>
	<div class="drawer-side z-10">
		<label for="main-drawer" class="drawer-overlay" />
		<DrawerMain bind:nav_drawer />
	</div>
</div>
