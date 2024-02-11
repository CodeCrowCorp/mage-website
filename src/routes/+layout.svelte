<script lang="ts">
	import '$lib/assets/styles/tailwind-output.css'
	import { category_assets, category_list } from '$lib/stores/channelStore'

	// @ts-ignore
	import NProgress from 'nprogress'
	import { page, navigating } from '$app/stores'

	// NProgress Loading bar
	import '$lib/assets/styles/nprogress.css'
	import LoginPrompt from '$lib/components/Global/LoginPrompt.svelte'
	import DrawerMain from '$lib/components/Global/DrawerMain.svelte'
	import { onMount } from 'svelte'
	// import { get, put } from '$lib/api'
	// import { emitUserConnection, initPlatformSocket, platformSocket } from '$lib/websocket'
	// import { platform_connection, platform_message } from '$lib/stores/websocketStore'
	// import { isJsonString } from '$lib/utils'
	import IconMageText from '$lib/assets/icons/IconMageText.svelte'
	import { current_theme } from '$lib/stores/helperStore'
	import {
		is_feature_video_responses_enabled,
		is_feature_premium_enabled,
		is_feature_apps_enabled,
		is_feature_merge_platforms_enabled,
		is_feature_merch_enabled
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
		$is_feature_merge_platforms_enabled = env.PUBLIC_FEATURE_MERGE_PLATFORMS === 'true'
		$is_feature_merch_enabled = env.PUBLIC_FEATURE_MERCH === 'true'
		const devSvgs = import.meta.glob('$lib/assets/icons/category-icons/dev/*.svg', {
			eager: true
		})
		const gameSvgs = import.meta.glob('$lib/assets/icons/category-icons/game/*.svg', {
			eager: true
		})
		processSvgs(devSvgs, 'dev')
		processSvgs(gameSvgs, 'game')
		getUserRole()
		// await handleWebsocket()
	})

	const processSvgs = (svgs: any, category: any) => {
		const modules = Object.values(svgs)
		modules.forEach((module: any) => {
			let filename = module.default.split('/').pop() || ''
			filename = filename
				.replace(/\.[A-Za-z0-9\s]*\.svg$/, '')
				.replace(/-/g, ' ')
				.replace(/\w\S*/g, (w: any) => w.replace(/^\w/, (c: any) => c.toUpperCase()))
			$category_list[filename] = module.default
			$category_assets[category][filename] = module.default
		})
	}

	const getUserRole = async () => {
		//TODO: get role from backend
		$user_role = 'user'
	}

	// const handleWebsocket = async () => {
	// 	try {
	// 		if ($page.data.user?.userId) {
	// 			const platformSocketId = await get(`wsinit/wsid`)
	// 			initPlatformSocket({ websocketId: platformSocketId })
	// 			platformSocket.addEventListener('open', (data) => {
	// 				console.log('socket connection open')
	// 				console.log(data)
	// 				$platform_connection = 'open'
	// 			})
	// 			platformSocket.addEventListener('message', (data) => {
	// 				console.log('listening to messages')
	// 				console.log(data.data)
	// 				if (isJsonString(data.data)) platform_message.set(data.data)
	// 			})
	// 			platformSocket.addEventListener('error', (data) => {
	// 				console.log('socket connection error')
	// 				console.log(data)
	// 			})
	// 			platformSocket.addEventListener('close', (data) => {
	// 				console.log('socket connection close')
	// 				console.log(data)
	// 				$platform_connection = 'close'
	// 				attemptReconnect()
	// 			})
	// 		}
	// 	} catch (error) {
	// 		attemptReconnect()
	// 	}
	// }
	// const attemptReconnect = () => {
	// 	setTimeout(async () => {
	// 		console.log('Reconnecting to WebSocket...')
	// 		await handleWebsocket()
	// 	}, 4000)
	// }
	// platform_connection.subscribe(async (value: any) => {
	// 	if (!value) return
	// 	$is_online = value === 'open'
	// 	if ($page.data.user?.userId && value === 'open') {
	// 		emitUserConnection({ userId: $page.data.user?.userId, isOnline: $is_online })
	// 	}
	// })
</script>

<svelte:head>
	<link rel="stylesheet" href="/fonts/montserrat.css" />
	{@html `<script> 
          const theme = localStorage.getItem('theme') || 'dark';
          document.querySelector('html').dataset.theme = theme;
        </script>`}

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@GaganSuie" />
	<meta
		name="twitter:title"
		content={$page.data.seo?.title || 'Mage - A collaborative streaming platform'} />
	<meta
		name="twitter:description"
		content={$page.data.seo?.description ||
			'Mage is a collaborative streaming platform for gamers and developers'} />
	<meta name="twitter:image" content={$page.data.seo?.image || '%sveltekit.assets%/banner.png'} />
	<meta name="twitter:image:alt" content={$page.data.seo?.imageAlt || 'Mage Banner'} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.data.seo?.url || 'https://mage.stream'} />
	<meta
		property="og:title"
		content={$page.data.seo?.title || 'Mage - A collaborative streaming platform'} />
	<meta
		property="og:description"
		content={$page.data.seo?.description ||
			'Mage is a collaborative streaming platform for gamers and developers'} />
	<meta property="og:image" content={$page.data.seo?.image || '%sveltekit.assets%/banner.png'} />
	<meta property="og:image:alt" content={$page.data.seo?.imageAlt || 'Mage Banner'} />

	<meta charset="utf-8" />
	<!-- <link rel="canonical" href="https://mage.stream" /> -->
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

<style>
	:global(.svelte-tags-input-layout) {
		--tw-border-opacity: 1 !important;
		height: 3rem;
		padding-left: 1rem !important;
		padding-right: 1rem !important;
		--tw-bg-opacity: 1 !important;
		flex-wrap: nowrap !important;
	}
	:global(.svelte-tags-input-layout) {
		@apply mt-5 w-full !input !input-primary !input-bordered;
	}
	:global(.svelte-tags-input-layout:focus-within) {
		outline-offset: 2px !important;
	}
	:global(.svelte-tags-input) {
		width: 100%;
		font-size: 1rem !important;
		font-family: inherit !important;
	}

	:global(.svelte-tags-input-tag) {
		padding-left: 0.5rem !important;
		padding-right: 0.5rem !important;
		border-radius: var(--rounded-badge, 1.5rem) !important;
	}
</style>
