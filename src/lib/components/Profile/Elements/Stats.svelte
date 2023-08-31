<script lang="ts">
	import IconProfileViews from '$lib/assets/icons/profile/IconProfileViews.svelte'
	import IconProfileStreak from '$lib/assets/icons/profile/IconProfileStreak.svelte'
	import IconProfileStreamDuration from '$lib/assets/icons/profile/IconProfileStreamDuration.svelte'
	import { colorFromLevel, levelAndBarValueFromExp } from '$lib/utils'
	import { onMount } from 'svelte'
	// import IconProfileSponsor from '$lib/assets/icons/profile/IconProfileSponsor.svelte'

	let progressBarLevel = 1
	let progressBarValue = 0
	let progressBarColor = colorFromLevel(1)

	export let profile: any,
		totalPageViews: any,
		viewsMonthlyIncr: any,
		highestAndCurrentStreak: any,
		streakMonthlyIncr: any,
		totalAndAvgHours: any,
		totalHoursMonthlyIncr: any,
		avgHours: any

	onMount(async () => {
		if (profile) {
			let exp = profile.exp || 0
			let levelAndBarValue = levelAndBarValueFromExp(exp)
			progressBarLevel = levelAndBarValue.level
			progressBarValue = levelAndBarValue.barValue
			progressBarColor = colorFromLevel(progressBarLevel)

			totalPageViews = (await totalPageViews) || 0
			viewsMonthlyIncr = (await viewsMonthlyIncr) || 0
			highestAndCurrentStreak = (await highestAndCurrentStreak) || 0
			streakMonthlyIncr = (await streakMonthlyIncr) || 0
			totalAndAvgHours = (await totalAndAvgHours) || 0
			totalHoursMonthlyIncr = (await totalHoursMonthlyIncr) || 0
			avgHours = (await avgHours) || 0
		}
	})
</script>

<div class="flex justify-center items-center mb-9">
	<div
		class="tooltip tooltip-open tooltip-left w-fit tooltip-primary"
		data-tip="level {progressBarLevel}">
		<progress
			class="tooltip progress w-[17rem] mt-3"
			style="--progress-bar-color: {progressBarColor}"
			value={progressBarValue}
			max="100" />
	</div>
</div>
<div class="stats shadow bg-base-200">
	<div class="stat">
		<div class="stat-figure text-primary">
			<IconProfileViews />
		</div>
		<div class="stat-title">Page Views</div>
		<div class="stat-value text-primary">{totalPageViews}</div>
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
		<div class="stat-title">Total / Avg Hours</div>
		<div class="stat-value text-secondary">{totalAndAvgHours} / {avgHours}</div>
		<div class="stat-desc">{totalHoursMonthlyIncr.monthlyChange} % more than last month</div>
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

<style>
	progress::-webkit-progress-value {
		background-color: var(--progress-bar-color);
	}
</style>
