<script lang="ts">
	import { page } from '$app/stores'
	import { del, get, put } from '$lib/api'
	import IconMore from '$lib/assets/icons/IconMore.svelte'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import { follower_count, following_count } from '$lib/stores/profileStore'
	export let followItem: any

	export let profileId: string

	$: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}

	// const refreash = async () => {
	// 	$follower_count = await get(`follows/count?source=${profileId}&sourceType=source1`, auth)
	// 	$following_count = await get(`follows/count?source=${profileId}&sourceType=source2`, auth)

	// 	if ($page.data.user?.userId) {
	// 		const follow = await get(`follows/relationship?source=${profileId}`, auth)
	// 		followItem.isFollower = follow.isFollower
	// 		followItem.isFollowing = follow.isFollowing
	// 	}
	// }

	// const doFollow = async (isFollow: any) => {
	// 	const source1 = followItem._id
	// 	const source2 = $page.data.user?.userId
	// 	if (isFollow) {
	// 		await put(`follows`, { source1, source2 }, auth)
	// 	} else {
	// 		await del(`follows?source1=${source1}&source2=${source2}`, auth)
	// 	}
	// 	await refreash()
	// }
</script>

<div class="flex flex-row gap-2 px-4 py-2 card bg-base-100 justify-between mb-1">
	<div class="flex">
		<div class="avatar">
			<div class="w-16 mask {followItem.planTier > 0 ? 'mask-hexagon' : 'mask-squircle'}">
				<img class="w-16" loading="lazy" src={followItem.avatar} alt="user avatar" />
			</div>
		</div>

		<div class="flex flex-col justify-center pl-4 text-start">
			<p>{followItem.displayName}</p>
			<p class="flex gap-1">
				@{followItem.username}{#if followItem.planTier > 0}
					<div class="text-accent font-bold">
						<IconDrawerVerification />
					</div>
				{/if}
			</p>
		</div>
	</div>

	<div class="flex flex-row items-center gap-4">
		<!-- <button
			class="btn btn-sm btn-secondary text-white"
			disabled={followItem?._id === $page.data.user?.userId}
			on:click={() => doFollow(!followItem?.isFollowing)}
			>{followItem.isFollowing ? 'Follow' : 'Unfollow'}</button> -->
		<div class="dropdown dropdown-end">
			<button class="btn btn-circle" tabindex="0">
				<IconMore />
			</button>
			<ul tabindex="-1" class="z-20 dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
				<li>
					<a href="/{followItem.username}">Profile</a>
				</li>
			</ul>
		</div>
	</div>
</div>
