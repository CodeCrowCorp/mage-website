<script lang="ts">
	import IconLink from '$lib/assets/icons/IconLink.svelte'
	import IconDrawerVerification from '$lib/assets/icons/drawer/IconDrawerVerification.svelte'
	import Favicon from '$lib/components/Profile/Favicon.svelte'
	import { category_list } from '$lib/stores/channelStore'
	import { colorFromLevel, levelAndBarValueFromExp } from '$lib/utils'
	import { onMount } from 'svelte'

	let progressBarLevel = 1
	let progressBarValue = 0
	let progressBarColor = colorFromLevel(1)

	export let profile: any

	onMount(async () => {
		if (profile) {
			let exp = profile.exp || 0
			let levelAndBarValue = levelAndBarValueFromExp(exp)
			progressBarLevel = levelAndBarValue.level
			progressBarValue = levelAndBarValue.barValue
			progressBarColor = colorFromLevel(progressBarLevel)
		}
	})
</script>

<div class="text-center flex flex-col items-center">
	{#if profile.displayName}
		<h3 class="text-4xl font-semibold leading-normal mb-2">
			{profile.displayName || ''}
		</h3>
	{/if}
	{#if profile.username}
		<div class="text-lg leading-normal mt-0 mb-2 font-bold flex gap-1">
			@{profile.username || ''}
			{#if profile?.planTier > 1}
				<div class="text-accent font-bold">
					<IconDrawerVerification />
				</div>
			{/if}
		</div>
	{/if}
	{#if profile.bio}
		<div class="text-lg leading-normal mt-0 mb-2">
			{profile.bio || ''}
		</div>
	{/if}

	<div class="pt-4 mb-2 flex flex-col">
		{#if profile.urls?.length}
			<div class="card bg-base-200 p-3 tooltip tooltip-left" data-tip="social">
				<div
					class="flex gap-2 justify-center items-center lg:overflow-hidden overflow-auto max-w-full">
					{#each profile.urls || [] as url, index (index)}
						{#if url}
							<Favicon {url} />
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		{#if profile.category?.length}
			<div class="card bg-base-200 p-3 mt-4 tooltip tooltip-left" data-tip="category">
				<div class="flex gap-2 justify-center">
					{#each profile.category as category}
						<div class="tooltip" data-tip={category}>
							<img src={$category_list[category]} alt="" class="h-7 w-7 m-1" />
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div class="flex justify-center items-center">
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
</div>

<style>
	progress::-webkit-progress-value {
		background-color: var(--progress-bar-color);
	}
</style>
