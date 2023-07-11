<script lang="ts">
	import { page } from '$app/stores'
	import { get, post } from '$lib/api'
	import { onMount } from 'svelte'
	import { setProfile, getProfile } from '$lib/stores/helperStore'
	import { clickOutside } from '$lib/utils.js'

	export let userId: string
	let profileData: any = getProfile(userId) || { profile: {} }
	let loading = false
	let show = false
	let elt: any

	const toggle = async () => {
		show = !show
		if (show) loadProfile(false)
	}

	const handleClickOutside = (event: any) => {
		show = false
	}

	const doSubscribe = async () => {
		loading = true
		const resp = await post('subscribe', {
			source1: profileData.profile._id,
			source2: $page.data.user?.userId,
			isSubscriber: true
		})
		loadProfile(true)
		loading = false
	}

	const loadProfile = async (refresh: boolean) => {
		loading = true
		if (getProfile(userId) && !refresh) {
			profileData = getProfile(userId)
			console.log('profile loaded from local')
		} else {
			profileData.profile = await get(`users/search/id?userId=${userId}`)
			profileData.subscriberCount = await get(
				`subscribes/count?source=${userId}&sourceType=source1`
			)
			profileData.interestCount = await get(`subscribes/count?source=${userId}&sourceType=source2`)
			if ($page.data.user?.userId) {
				profileData.isSubscribed = await get(`subscribes/relationship?source=${profile._id}`, {
					userId: $page.data.user?.userId,
					token: $page.data.user?.token
				})
			}

			setProfile(userId, profileData)
			console.log('profile loaded from server')
		}
		loading = false
	}

	$: profile = profileData.profile
	$: subscriberCount = profileData.subscriberCount || 0
	$: interestCount = profileData.interestCount || 0
	$: margin = (elt ? elt.getBoundingClientRect().height : 0) + 40
	$: isSelf = userId === $page.data.user?.userId
</script>

<span use:clickOutside={handleClickOutside}>
	{#if show}
		<div
			style="margin-top: {-margin}px"
			bind:this={elt}
			data-popover
			class="absolute -mt-2 z-50 dropdown-content text-sm font-light bg-base-200 card shadow-sm w-full">
			<div class="p-3">
				<div class="flex items-center justify-between mb-2">
					<span>
						<img
							class="w-10 h-10 mask mask-squircle"
							src={profileData.profile.avatar}
							alt={profileData.profile.avatar} />
					</span>
					<!-- <div>
						<button
							on:click={doSubscribe}
							disabled={isSelf || loading}
							type="button"
							class="btn btn-secondary btn-sm">
							{loading ? 'Loading...' : !profileData.isSubscribed ? 'Subscribe' : 'Unsubscribe'}
						</button>
					</div> -->
				</div>

				<p class="text-base font-semibold leading-none">
					{profileData.profile.displayName || ''}
				</p>
				<p class="mb-3 text-sm font-normal">
					<a class="link link-hover" href="/profile/{profileData.profile.username}"
						>@{profileData.profile.username || ''}</a>
				</p>
				<p class="mb-4 text-sm font-light">
					{profileData.profile.bio || ''}
				</p>
				<div class="flex text-sm gap-5">
					<a class="link link-hover">
						<span class="font-semibold">{subscriberCount}</span> Subscribers</a>
					<a class="link link-hover">
						<span class="font-semibold">{interestCount}</span> Interests</a>
				</div>
			</div>
		</div>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span class="cursor-pointer" on:click={toggle}>
		<slot />
	</span>
</span>
