<script lang="ts">
	import { page } from '$app/stores'
	import { get } from '$lib/api'
	import { setProfile, getProfile } from '$lib/stores/helperStore'
	import { clickOutside } from '$lib/utils.js'
	import { put, del } from '$lib/api'
	import { createEffect } from '$lib/utils'

	export let userId: string
	export let open: boolean
	export let onOutsideClick: any
	export let elt: any

	let self: any

	const useOueryEffect = createEffect()

	let profileData: any = getProfile(userId) || { profile: {} }
	let loading = false

	$: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}

	const handleClickOutside = (event: any) => {
		if (onOutsideClick) onOutsideClick()
	}

	const doFollow = async (isFollow: any) => {
		loading = true

		const source1 = profileData.profile._id
		const source2 = $page.data.user?.userId
		const isFollowing = isFollow.toString()
		if(!profileData.isFollowed)
			profileData.isFollowed = {}

		if (isFollowing == 'true') {
			await put(`follows`, { source1, source2 }, auth)
			profileData.followerCount++
			profileData.isFollowed.isFollowing = true
		} else {
			await del(`follows?source1=${source1}&source2=${source2}`, auth)
			profileData.followerCount--
			profileData.isFollowed.isFollowing = false
		}
		setProfile(userId, profileData)
		loading = false
	}

	const loadProfile = async (refresh: boolean) => {
		loading = true
		if (getProfile(userId) && !refresh) {
			profileData = getProfile(userId)
		} else {
			profileData.profile = await get(`users/search/username?username=${userId}`, auth)
			const id = profileData.profile._id
			profileData.followerCount = await get(
				`follows/count?source=${id}&sourceType=source1`,
				auth
			)
			profileData.followingCount = await get(
				`follows/count?source=${id}&sourceType=source2`,
				auth
			)
			if ($page.data.user?.userId) {
				profileData.isFollowed = await get(`follows/relationship?source=${id}`, auth)
			}

			console.log("profileData: ", profileData)

			setProfile(userId, profileData)
		}
		loading = false
	}

	$: useOueryEffect(() => {
		if (open && userId) {
			profileData = { profile: {} }
			loadProfile(false)
		}
	}, [open, userId])


	$:console.log("userIdd",userId);
	$: profile = profileData.profile
	$: followerCount = profileData.followerCount || 0
	$: followingCount = profileData.followingCount || 0
	$: margin = (self ? self.getBoundingClientRect().height : 0) + 40
	$: top = (elt ? elt.getBoundingClientRect().top : 0) + 40
	$: isSelf = userId === $page.data.user?.userId

</script>

<span use:clickOutside={handleClickOutside}>
	{#if open}
		<div
			style="margin-top: {-margin}px; top: {top}px;"
			bind:this={self}
			data-popover
			class="absolute -mt-2 z-50 dropdown-content text-sm font-light bg-base-200 card shadow-sm w-80">
			<div class="p-3">
				<div class="flex items-center justify-between mb-2">
					<span>
						{#if !profileData?.profile?.avatar}
							<div class="animate-pulse flex space-x-4 mb-1">
								<div class="rounded bg-slate-200 h-8 w-24" />
							</div>
						{:else}
							<img
								class="w-10 h-10 mask mask-squircle"
								src={profileData?.profile?.avatar}
								alt={profileData?.profile?.avatar} />
						{/if}
					</span>
					<div>
						<button
							on:click={() => doFollow(!profileData?.isFollowed?.isFollowing)}
							disabled={isSelf || loading}
							type="button"
							class="btn btn-secondary btn-sm">
							{#if loading}
								<span class="loading loading-dots loading-md" />
							{:else if profileData?.isFollowed?.isFollowing}
								Unfollow
							{:else}
								Follow
							{/if}
						</button>
					</div>
				</div>

				{#if !profileData?.profile?.displayName && !profileData?.profile?.username}
					<div class="animate-pulse flex space-x-4 mb-3">
						<div class="rounded bg-slate-200 h-12 w-full" />
					</div>
				{:else}
					<p class="text-base font-semibold leading-none">
						{profileData?.profile?.displayName}
					</p>
					<p class="mb-3 text-sm font-normal">
						<a class="link link-hover" href="/profile/{profileData?.profile?.username}"
							>@{profileData?.profile?.username}</a>
					</p>
				{/if}

				<p class="mb-4 text-sm font-light">
					{profileData?.profile?.bio || " "}
				</p>
				<div class="flex text-sm gap-5">
					{#if !followerCount && !followingCount}
						<div class="animate-pulse flex space-x-4 w-full -mt-1">
							<div class="rounded bg-slate-200 h-4 w-full" />
						</div>
					{:else}
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="link link-hover">
							<span class="font-semibold">{followerCount}</span> Followers</a>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="link link-hover">
							<span class="font-semibold">{followingCount}</span> Following</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</span>
