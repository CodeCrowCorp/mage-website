<script lang="ts">
	import ListSubscribe from '$lib/components/Profile/ListSubscribe.svelte'
	import SectionTable from '$lib/components/Browse/Sections/SectionTable.svelte'
	import Stats from '$lib/components/Profile/Elements/Stats.svelte'
	import { is_feature_stats_enabled } from '$lib/stores/remoteConfigStore'
	import { onMount } from 'svelte'
	import { env } from '$env/dynamic/public'

	export let profile: any,
		channels: any,
		totalPageViews: any,
		viewsMonthlyIncr: any,
		highestAndCurrentStreak: any,
		totalAndAvgHours: any,
		streakMonthlyIncr: any,
		totalHoursMonthlyIncr: any,
		avgHours: any

	let tabs: string[] = []
	let activeTab = 0

	onMount(() => {
		$is_feature_stats_enabled = env.PUBLIC_FEATURE_STATS === 'true'
		tabs = ['Channels', 'Followers']
		if ($is_feature_stats_enabled) tabs.push('Stats')
		console.log('got here----', JSON.stringify(profile))
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
			{#if $is_feature_stats_enabled}
				<div class="grid h-full" class:hidden={activeTab != tabs.indexOf('Stats')}>
					<Stats
						{profile}
						{avgHours}
						{viewsMonthlyIncr}
						{streakMonthlyIncr}
						{totalHoursMonthlyIncr}
						{totalPageViews}
						{highestAndCurrentStreak}
						{totalAndAvgHours} />
				</div>
			{/if}
		</div>
	</div>
</div>
