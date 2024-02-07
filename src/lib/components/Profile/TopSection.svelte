<script lang="ts">
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import { page } from '$app/stores'
	import { follower_count, following_count } from '$lib/stores/profileStore'
	import { put, del } from '$lib/api'
	import { get } from '$lib/api'
	import { createEffect, getNumberInThousands } from '$lib/utils'
	import { is_feature_premium_enabled } from '$lib/stores/remoteConfigStore'

	export let profile: any,
		showDrawer = false,
		totalPageViews: any,
		isOnboarded: any

	const useOueryEffect = createEffect()

	$: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}

	let subValues: any = null,
		isFollowed: any = null

	const refreash = async () => {
		$follower_count = await get(`follows/count?source=${profile._id}&sourceType=source1`, auth)
		$following_count = await get(`follows/count?source=${profile._id}&sourceType=source2`, auth)
		if ($page.data.user?.userId) {
			isFollowed = await get(`follows/relationship?source=${profile._id}`, auth)
			subValues = isFollowed
		}
	}

	const doFollow = async (isFollow: any) => {
		subValues = null
		const source1 = profile._id
		const source2 = $page.data.user?.userId

		if (isFollow) {
			await put(`follows`, { source1, source2 }, auth)
		} else {
			await del(`follows?source1=${source1}&source2=${source2}`, auth)
		}
		refreash()
	}

	$: useOueryEffect(async () => {
		refreash()
	}, [profile._id])

	$: currentUser = $page.data.user?.user
	$: subValues
</script>

<div class="flex flex-wrap justify-center">
	<div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
		<div class="relative">
			{#if profile.avatar}
				<div class="w-32 h-32">
					<div class="avatar -top-16">
						<div
							class="mask {profile.planTier > 1
								? 'mask-hexagon'
								: 'mask-squircle'} h-auto align-middle max-w-150-px">
							<img src={profile.avatar} alt="" class="!w-32 !h-32" />
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
		<div class="py-6 px-3 justify-center flex md:justify-end gap-4">
			<div class="flex gap-4">
				<button
					disabled={!subValues || profile._id === $page.data.user?.userId || !currentUser}
					on:click={() => doFollow(!subValues?.isFollowing)}
					class="btn btn-secondary">
					{#if !subValues}
						<span class="loading loading-dots loading-md" />
					{:else if subValues?.isFollowing}
						Unfollow
					{:else}
						Follow
					{/if}
				</button>
				<!--TODO: open sponsor dialog-->
				<button class="btn btn-primary" formaction="?/sponsor" disabled>Sponsor</button>
			</div>
			{#await isOnboarded}
				<button class="btn btn-circle" tabindex="0" disabled>
					<IconMore />
				</button>
			{:then value}
				<div class="dropdown dropdown-end">
					{#if !value}
						<div class="z-30 absolute top-0 right-0 badge badge-secondary badge-xs animate-ping" />
					{/if}
					<button
						class="btn btn-circle"
						tabindex="0"
						disabled={currentUser?.username !== $page.params.username}>
						<IconMore />
					</button>
					<ul tabindex="-1" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
						<li>
							<label for="edit-profile-drawer" on:click={() => (showDrawer = true)}>Edit</label>
							{#if $is_feature_premium_enabled && $page.data.user.user.planTier >= 0}
								<form class="mt-auto" method="post">
									<button formaction="?/access-dashboard"
										>{value ? 'Payout dashboard' : 'Complete Onboarding'}</button>
								</form>
							{/if}
						</li>
					</ul>
				</div>
			{/await}
		</div>
	</div>
	<div class="w-full lg:w-4/12 px-4 lg:order-1">
		<div class="flex justify-center py-4 lg:pt-4 pt-8">
			<div
				class="mr-4 p-3 text-center tooltip"
				data-tip="{getNumberInThousands($follower_count || 0)} followers">
				<span class="text-xl font-bold block uppercase tracking-wide"
					>{getNumberInThousands($follower_count || 0)}</span
				><span class="text-sm">Followers</span>
			</div>
			<div
				class="mr-4 p-3 text-center tooltip"
				data-tip="{getNumberInThousands($following_count || 0)} following">
				<span class="text-xl font-bold block uppercase tracking-wide"
					>{getNumberInThousands($following_count || 0)}</span
				><span class="text-sm">Following</span>
			</div>
			<div
				class="lg:mr-4 p-3 text-center tooltip"
				data-tip="{getNumberInThousands(totalPageViews || 0)} page views">
				<span class="text-xl font-bold block uppercase tracking-wide"
					>{getNumberInThousands(totalPageViews || 0)}</span
				><span class="text-sm">Views</span>
			</div>
		</div>
	</div>
</div>
