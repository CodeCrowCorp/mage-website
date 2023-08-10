<script lang="ts">
	import IconProfileViews from '$lib/assets/icons/profile/IconProfileViews.svelte'
	import IconProfileStreak from '$lib/assets/icons/profile/IconProfileStreak.svelte'
	import IconProfileStreamDuration from '$lib/assets/icons/profile/IconProfileStreamDuration.svelte'
	import { page } from '$app/stores'
	import { colorFromLevel, levelAndBarValueFromExp } from '$lib/utils'
	import { onMount } from 'svelte'
	// import IconProfileSponsor from '$lib/assets/icons/profile/IconProfileSponsor.svelte'
	$: currentUser = $page.data.user?.user
	let progressBarLevel = 1
	let progressBarValue = 0
	let progressBarColor = colorFromLevel(1)
	$: isChannelPage = $page.url.pathname.includes('/channel')
	
	export let totalPageViews: any,
		viewsMonthlyIncr: any,
		highestAndCurrentStreak: any,
		streakMonthlyIncr: any,
		totalAndAvgHours: any,
		totalHoursMonthlyIncr: any,
		avgHours: any


	onMount(()=>{
		if(currentUser){
			let exp = currentUser.exp || 0
	let levelAndBarValue = levelAndBarValueFromExp(exp)
	progressBarLevel = levelAndBarValue.level
	progressBarValue = levelAndBarValue.barValue
	progressBarColor = colorFromLevel(progressBarLevel)
	let isChannelPage = false
		}
	})
</script>

<div class="tooltip" data-tip="level {progressBarLevel}">
	<progress
		class="tooltip progress w-[17rem] mt-3 {isChannelPage ? 'md:w-12' : ''}"
		style="--progress-bar-color: {progressBarColor}"
		value={progressBarValue}
		max="100" />
</div>
<div class="stats shadow bg-base-200">
	<div class="stat">
		<div class="stat-figure text-primary">
			<IconProfileViews />
		</div>
		<div class="stat-title">Page Views</div>
		<div class="stat-value text-primary">{totalPageViews}</div>
		<div class="stat-desc">{viewsMonthlyIncr.monthlyChange} more than last month</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileStreak />
		</div>
		<div class="stat-title">Highest / Current Streak</div>
		<div class="stat-value text-secondary">{highestAndCurrentStreak.highest} / {highestAndCurrentStreak.current}</div>
		<div class="stat-desc">{streakMonthlyIncr.monthlyChange} more than last month</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileStreamDuration />
		</div>
		<div class="stat-title">Total / Avg Hours</div>
		<div class="stat-value text-secondary">{totalAndAvgHours} / {avgHours}</div>
		<div class="stat-desc">{totalHoursMonthlyIncr.monthlyChange} more than last month</div>
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
