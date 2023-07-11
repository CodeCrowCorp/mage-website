<script lang="ts">
	import { page } from '$app/stores'
	import { get, post } from '$lib/api'
	import { onMount } from 'svelte'
	import { setProfile, getProfile } from '$lib/stores/helperStore'
	import { clickOutside } from '$lib/utils.js'
	import { put, del } from '$lib/api'

	export let userId: string
	let profileData: any = getProfile(userId) || { profile: {} }
	let loading = false
	let show = false
	let elt: any

	$: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}

	const toggle = async () => {
		show = !show
		if (show) loadProfile(false)
	}

	const handleClickOutside = (event: any) => {
		show = false
	}

	const doFollow = async (isFollow: any) => {
		loading = true

		const source1 = profile._id
		const source2 = $page.data.user?.userId
		const isFollowing = isFollow.toString()

		if (isFollowing == 'true') {
			await put(`follows`, { source1, source2 }, auth)
		} else {
			await del(`follows?source1=${source1}&source2=${source2}`, auth)
		}

		await loadProfile(true)
		loading = false
	}

	const loadProfile = async (refresh: boolean) => {
		loading = true
		if (getProfile(userId) && !refresh) {
			profileData = getProfile(userId)
		} else {
			profileData.profile = await get(`users/search/id?userId=${userId}`, auth)
			profileData.followerCount = await get(
				`follows/count?source=${userId}&sourceType=source1`,
				auth
			)
			profileData.followingCount = await get(
				`follows/count?source=${userId}&sourceType=source2`,
				auth
			)
			if ($page.data.user?.userId) {
				profileData.isFollowed = await get(`follows/relationship?source=${profile._id}`, auth)
			}

			setProfile(userId, profileData)
		}
		loading = false
	}

	$: profile = profileData.profile
	$: followerCount = profileData.followerCount || 0
	$: followingCount = profileData.followingCount || 0
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
					<div>
						<button
							on:click={() => doFollow(!profileData.isFollowed?.isInterested)}
							disabled={isSelf || loading}
							type="button"
							class="btn btn-secondary btn-sm">
							{#if loading}
								<span class="loading loading-dots loading-md" />
							{:else if profileData.isFollowed?.isInterested}
								Unfollow
							{:else}
								Follow
							{/if}
						</button>
					</div>
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
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="link link-hover">
						<span class="font-semibold">{followerCount}</span> Followers</a>
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="link link-hover">
						<span class="font-semibold">{followingCount}</span> Following</a>
				</div>
			</div>
		</div>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span class="cursor-pointer" on:click={toggle}>
		<slot />
	</span>
</span>
