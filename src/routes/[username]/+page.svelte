<script lang="ts">
	import DrawerEditProfile from '$lib/components/Profile/DrawerEditProfile.svelte'
	import TabSection from '$lib/components/Profile/TabSection.svelte'
	import TopSection from '$lib/components/Profile/TopSection.svelte'
	import UserDetails from '$lib/components/Profile/Elements/UserDetails.svelte'
	import WholePageSkeleton from '$lib/components/Profile/Elements/WholePageSkeleton.svelte'
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { post } from '$lib/api'

	export let data: PageData
	let totalPageViews: any,
		totalChannelViews: any,
		totalChannelViews4Weeks: any,
		showDrawer = false,
		banner =
			data.profile?.banner ||
			'https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80'

	onMount(async () => {
		if ($page.data.user?.userId !== data.profile._id) {
			await post(
				`analytics/view`,
				{
					type: 'view',
					userId: $page.data.user?.userId,
					viewType: 'user',
					viewId: data.profile._id
				},
				{
					userId: $page.data.user.userId,
					token: $page.data.user.token
				}
			)
		}
		totalPageViews = (await data.lazy.totalPageViews) || 0
		totalChannelViews = (await data.lazy.totalChannelViews) || 0
		totalChannelViews4Weeks = (await data.lazy.totalChannelViews4Weeks) || 0
	})
</script>

{#if !data.profile}
	<WholePageSkeleton />
{:else}
	<div class="relative block h-[31rem]">
		<div
			class="absolute top-0 w-full h-full bg-center bg-cover"
			style="background-image: url({banner});">
			<span id="blackOverlay" class="w-full h-full absolute opacity-50 bg-black" />
		</div>
	</div>
	<div class="relative py-16">
		<div class="container mx-auto px-4">
			<div
				class="relative flex flex-col min-w-0 break-words bg-base-100 w-full mb-6 shadow-xl rounded-lg -mt-64">
				<div class="px-6">
					<TopSection profile={data.profile} bind:showDrawer {totalPageViews} />
					<UserDetails profile={data.profile} />
					<TabSection
						profile={data.profile}
						channels={data.lazy.channels}
						{totalChannelViews}
						{totalChannelViews4Weeks}
						viewsMonthlyIncr={data.lazy.viewsMonthlyIncr}
						highestAndCurrentStreak={data.lazy.highestAndCurrentStreak}
						streakMonthlyIncr={data.lazy.streakMonthlyIncr}
						totalMins={data.lazy.totalMins}
						totalMinsMonthlyIncr={data.lazy.totalMinsMonthlyIncr}
						avgMins={data.lazy.avgMins} />
				</div>
			</div>
		</div>
	</div>
	{#if showDrawer}
		<DrawerEditProfile profile={data.profile} bind:showDrawer />
	{/if}
{/if}
