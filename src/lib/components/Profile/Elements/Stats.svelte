<script lang="ts">
	import IconProfileViews from '$lib/assets/icons/profile/IconProfileViews.svelte'
	import IconProfileStreak from '$lib/assets/icons/profile/IconProfileStreak.svelte'
	import IconProfileStreamDuration from '$lib/assets/icons/profile/IconProfileStreamDuration.svelte'
	// import IconProfileSponsor from '$lib/assets/icons/profile/IconProfileSponsor.svelte'
	export let totalPageViews: Promise<any>,
		highestAndCurrentStreak: Promise<any>,
		totalAndAvgHours: Promise<any>
</script>

<div class="tooltip" data-tip="level 1">
	<progress class="progress progress-accent w-64" value="30" max="100" />
</div>
<div class="stats shadow bg-base-200">
	<div class="stat">
		<div class="stat-figure text-primary">
			<IconProfileViews />
		</div>
		<div class="stat-title">Page Views</div>
		<div class="stat-value text-primary">2.6M</div>
		<div class="stat-desc">21% more than last month</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileStreak />
		</div>
		<div class="stat-title">Highest / Current Streak</div>
		<div class="stat-value text-secondary">25 / 5</div>
		<div class="stat-desc">21% more than last month</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<IconProfileStreamDuration />
		</div>
		<div class="stat-title">Total / Avg Hours</div>
		<div class="stat-value text-secondary">2,500 / 8</div>
		<div class="stat-desc">21% more than last month</div>
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
