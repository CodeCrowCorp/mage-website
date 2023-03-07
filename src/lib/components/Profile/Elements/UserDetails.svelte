<script lang="ts">
	import IconLink from '$lib/assets/icons/IconLink.svelte'
	import CategoryLoader from './CategoryLoader.svelte'
	import NameLoader from './NameLoader.svelte'

	export let profile: any,
		techList: any = []
</script>

<div class="text-center flex flex-col items-center">
	{#if profile?.displayName}
		<h3 class="text-4xl font-semibold leading-normal mb-2">
			{profile?.displayName || ''}
		</h3>
	{:else}
		<NameLoader />
	{/if}
	{#if profile?.username}
		<div class="text-lg leading-normal mt-0 mb-2 font-bold text-pink-500">
			@{profile?.username || ''}
		</div>
	{:else}
		<NameLoader />
	{/if}
	{#if profile?.bio || profile?.description}
		<div class="text-lg leading-normal mt-0 mb-2">
			{profile?.bio || profile?.description || ''}
		</div>
	{/if}
	<div class="pt-4">
		{#if profile?.html_url}
			<div class="flex gap-2 justify-center p-4">
				<IconLink />
				<a class="link link-info" href={profile?.html_url} target="_blank" rel="noreferrer"
					>{profile?.html_url || ''}</a>
			</div>
		{/if}
		<div class="flex gap-2 justify-center">
			{#if profile?.category}
				{#if profile?.category.length}
					{#each profile.category as category}
						<div class="tooltip" data-tip={category}>
							<img src={techList[category]} alt="" class="h-7 w-7 m-1" />
						</div>
					{/each}
				{:else}
					<CategoryLoader />
				{/if}
			{/if}
		</div>
	</div>
</div>
