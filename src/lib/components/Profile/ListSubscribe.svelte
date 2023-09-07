<script lang="ts">
	import FollowItem from '$lib/components/Profile/Elements/FollowItem.svelte'
	import { follower_count, following_count } from '$lib/stores/profileStore'
	import { get } from '$lib/api.js'
	import LoadMoreContaier from './LoadMore.svelte'
	import { page } from '$app/stores'
	import { getNumberInThousands } from '$lib/utils'

	export let profileId: string

	$: auth = {
		userId: $page?.data?.user?.userId,
		token: $page?.data?.user?.token
	}

	const searchFollowers = async (query: string, skip: number, limit: number) => {
		return await get(
			`follows?source=${profileId}&sourceType=source1&searchQuery=${query}&skip=${skip}&limit=${limit}`,
			auth
		)
	}

	const searchFollowing = async (query: string, skip: number, limit: number) => {
		return await get(
			`follows?source=${profileId}&sourceType=source2&searchQuery=${query}&skip=${skip}&limit=${limit}`,
			auth
		)
	}

	const getFollowers = async (skip: number, limit: number) => {
		return await get(
			`follows?source=${profileId}&sourceType=source1&skip=${skip}&limit=${limit}`,
			auth
		)
	}

	const getFollowing = async (skip: number, limit: number) => {
		return await get(
			`follows?source=${profileId}&sourceType=source2&skip=${skip}&limit=${limit}`,
			auth
		)
	}
</script>

<div class="flex flex-row justify-center gap-5 mt-8">
	<div class="card flex flex-col w-1/2 gap-2 bg-base-200 py-4 px-8">
		<p class="text-start font-semibold">Followers ({getNumberInThousands($follower_count || 0)})</p>

		<LoadMoreContaier
			let:list
			dataSource={getFollowers}
			searchDataSource={searchFollowers}
			inputPlaceholder="Search followers"
			count={$follower_count}>
			{#each list as followItem}
				<FollowItem {profileId} {followItem} />
			{/each}
		</LoadMoreContaier>
	</div>
	<div class="card flex flex-col w-1/2 gap-2 bg-base-200 py-4 px-8">
		<p class="text-start font-semibold">
			Following ({getNumberInThousands($following_count || 0)})
		</p>

		<LoadMoreContaier
			let:list
			dataSource={getFollowing}
			searchDataSource={searchFollowing}
			inputPlaceholder="Search following"
			count={$following_count}>
			{#each list as followItem}
				<FollowItem {profileId} {followItem} />
			{/each}
		</LoadMoreContaier>
	</div>
</div>
