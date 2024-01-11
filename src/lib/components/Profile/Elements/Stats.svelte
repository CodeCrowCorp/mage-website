<script lang="ts">
	import IconProfileViews from '$lib/assets/icons/profile/IconProfileViews.svelte'
	import IconProfileStreak from '$lib/assets/icons/profile/IconProfileStreak.svelte'
	import IconProfileStreamDuration from '$lib/assets/icons/profile/IconProfileStreamDuration.svelte'
	import { getNumberInThousands, timeSince } from '$lib/utils'
	import { onMount } from 'svelte'
	// import IconProfileSponsor from '$lib/assets/icons/profile/IconProfileSponsor.svelte'

	export let profile: any,
		totalChannelViews: any,
		totalChannelViewsWeek: any,
		viewsMonthlyChange: any,
		highestStreak: any,
		currentStreak: any,
		lastStreamAndDuration: any,
		totalMins: any,
		totalMinsMonthlyChange: any,
		dailyAvgMins: any

	onMount(async () => {
		if (profile) {
			viewsMonthlyChange = (await viewsMonthlyChange) || 0
			highestStreak = (await highestStreak) || 0
			currentStreak = (await currentStreak) || 0
			lastStreamAndDuration = (await lastStreamAndDuration) || 0
			totalMins = (await totalMins) || 0
			totalMinsMonthlyChange = (await totalMinsMonthlyChange) || 0
			dailyAvgMins = (await dailyAvgMins) || 0
		}
	})
</script>

<div class="stats shadow bg-base-200">
	<div class="stat">
		<div class="stat-figure text-primary">
			<IconProfileViews />
		</div>
		<div class="stat-title">Total / Wk Channel Views</div>
		<div class="stat-value text-primary">
			{getNumberInThousands(totalChannelViews || 0)} / {getNumberInThousands(
				totalChannelViewsWeek || 0
			)}
		</div>
		<div class="stat-desc">
			{viewsMonthlyChange >= 0 ? `${viewsMonthlyChange}% more` : `${viewsMonthlyChange}% less`}
			than last month
		</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileStreak />
		</div>
		<div class="stat-title">Highest / Current Streak</div>
		<div class="stat-value text-secondary">
			{highestStreak} / {currentStreak}
		</div>
		<div class="stat-desc">
			Last streamed
			{#if lastStreamAndDuration.duration > 0}
				{lastStreamAndDuration.duration} mins on {timeSince(lastStreamAndDuration.end)}
			{:else}
				never
			{/if}
		</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileStreamDuration />
		</div>
		<div class="stat-title">Total / Daily Avg Mins Streamed</div>
		<div class="stat-value text-secondary">{totalMins} / {dailyAvgMins}</div>
		<div class="stat-desc">
			{totalMinsMonthlyChange >= 0
				? `${totalMinsMonthlyChange}% more`
				: `${totalMinsMonthlyChange}% less`} than last month
		</div>
	</div>

	<!-- <div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileSponsor />
		</div>
		<div class="stat-title">Sponsors</div>
		<div class="stat-value text-secondary">500</div>
		<div class="stat-desc">21% more than last month</div>
	</div> -->
</div>
