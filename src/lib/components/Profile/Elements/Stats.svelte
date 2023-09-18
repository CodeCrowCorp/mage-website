<script lang="ts">
	import IconProfileViews from '$lib/assets/icons/profile/IconProfileViews.svelte'
	import IconProfileStreak from '$lib/assets/icons/profile/IconProfileStreak.svelte'
	import IconProfileStreamDuration from '$lib/assets/icons/profile/IconProfileStreamDuration.svelte'
	import { getNumberInThousands } from '$lib/utils'
	import { onMount } from 'svelte'
	// import IconProfileSponsor from '$lib/assets/icons/profile/IconProfileSponsor.svelte'

	export let profile: any,
		totalChannelViews: any,
		totalChannelViews4Weeks: any,
		viewsMonthlyIncr: any,
		highestAndCurrentStreak: any,
		streakMonthlyIncr: any,
		totalMins: any,
		totalMinsMonthlyIncr: any,
		avgMins: any

	onMount(async () => {
		if (profile) {
			viewsMonthlyIncr = (await viewsMonthlyIncr) || 0
			highestAndCurrentStreak = (await highestAndCurrentStreak) || 0
			streakMonthlyIncr = (await streakMonthlyIncr) || 0
			totalMins = (await totalMins) || 0
			totalMinsMonthlyIncr = (await totalMinsMonthlyIncr) || 0
			avgMins = (await avgMins) || 0
		}
	})
</script>

<div class="stats shadow bg-base-200">
	<div class="stat">
		<div class="stat-figure text-primary">
			<IconProfileViews />
		</div>
		<div class="stat-title">Total / 4-Wk Channel Views</div>
		<div class="stat-value text-primary">
			{getNumberInThousands(totalChannelViews || 0)} / {getNumberInThousands(
				totalChannelViews4Weeks || 0
			)}
		</div>
		<div class="stat-desc">{viewsMonthlyIncr.monthlyChange} % more than last month</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileStreak />
		</div>
		<div class="stat-title">Highest / Current Streak</div>
		<div class="stat-value text-secondary">
			{highestAndCurrentStreak.highest} / {highestAndCurrentStreak.current}
		</div>
		<div class="stat-desc">{streakMonthlyIncr.monthlyChange} % more than last month</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileStreamDuration />
		</div>
		<div class="stat-title">Total / Avg Mins</div>
		<div class="stat-value text-secondary">{totalMins} / {avgMins}</div>
		<div class="stat-desc">{totalMinsMonthlyIncr.monthlyChange} % more than last month</div>
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
