<script lang="ts">
	import ListSubscribe from '$lib/components/Profile/ListFollow.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import Analytics from '$lib/components/Profile/Elements/Analytics.svelte'
	import Events from '$lib/components/Profile/Events.svelte'
	import { onMount } from 'svelte'
	import { env } from '$env/dynamic/public'

	export let profile: any,
		channels: any,
		totalChannelViews: any,
		totalChannelViewsWeek: any,
		viewsMonthlyChange: any,
		currentStreak: any,
		highestStreak: any,
		totalMins: any,
		lastStreamAndDuration: any,
		totalMinsMonthlyChange: any,
		dailyAvgMins: any

	let tabs: string[] = []
	let activeTab = 0

	onMount(() => {
		tabs = ['Channels', 'Followers', 'Analytics'] // 'Events',
	})
</script>

<div class="mt-10 py-10 border-t border-blueGray-200 text-center">
	<div class="flex flex-wrap justify-center">
		<div class="tabs tabs-boxed flex justify-center mb-5 w-fit">
			{#each tabs as tab, index}
				<button
					class="tab"
					class:tab-active={activeTab == index}
					on:click={() => (activeTab = index)}>{tab}</button>
			{/each}
		</div>
		<div class="w-full px-4">
			<div class="flex-auto h-full text-left" class:hidden={activeTab != tabs.indexOf('Channels')}>
				<SectionTable {channels} profileId={profile._id} />
			</div>
			<div class="flex-auto h-full" class:hidden={activeTab != tabs.indexOf('Followers')}>
				<ListSubscribe profileId={profile._id} />
			</div>
			<!-- <div class="flex-auto h-full" class:hidden={activeTab != tabs.indexOf('Events')}>
				<Events profileId={profile._id} />
			</div> -->
			<div class="grid h-full" class:hidden={activeTab != tabs.indexOf('Analytics')}>
				<Analytics
					{profile}
					{dailyAvgMins}
					{viewsMonthlyChange}
					{lastStreamAndDuration}
					{totalMinsMonthlyChange}
					{totalChannelViews}
					{totalChannelViewsWeek}
					{highestStreak}
					{currentStreak}
					{totalMins} />
			</div>
		</div>
	</div>
</div>
