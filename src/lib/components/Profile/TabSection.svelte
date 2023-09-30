<script lang="ts">
	import ListSubscribe from '$lib/components/Profile/ListSubscribe.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import Stats from '$lib/components/Profile/Elements/Stats.svelte'
	import Events from '$lib/components/Profile/Events.svelte'
	import { onMount } from 'svelte'
	import { env } from '$env/dynamic/public'

	export let profile: any,
		channels: any,
		totalChannelViews: any,
		totalChannelViews4Weeks: any,
		viewsMonthlyIncr: any,
		highestAndCurrentStreak: any,
		totalMins: any,
		streakMonthlyIncr: any,
		totalMinsMonthlyIncr: any,
		avgMins: any

	let tabs: string[] = []
	let activeTab = 0

	onMount(() => {
		tabs = ['Channels', 'Followers', 'Events', 'Stats']
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
			<div class="flex-auto h-full" class:hidden={activeTab != tabs.indexOf('Events')}>
				<Events profileId={profile._id} />
			</div>
			<div class="grid h-full" class:hidden={activeTab != tabs.indexOf('Stats')}>
				<Stats
					{profile}
					{avgMins}
					{viewsMonthlyIncr}
					{streakMonthlyIncr}
					{totalMinsMonthlyIncr}
					{totalChannelViews}
					{totalChannelViews4Weeks}
					{highestAndCurrentStreak}
					{totalMins} />
			</div>
		</div>
	</div>
</div>
