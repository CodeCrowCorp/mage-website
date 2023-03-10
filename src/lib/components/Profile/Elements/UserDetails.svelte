<script lang="ts">
	import IconLink from '$lib/assets/icons/IconLink.svelte'
	import CategoryLoader from '$lib/components/Profile/Elements/CategoryLoader.svelte'
	import NameLoader from '$lib/components/Profile/Elements/NameLoader.svelte'
	import { category_list } from '$lib/stores/channelStore'

	export let profile: any
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
	{#if profile?.bio}
		<div class="text-lg leading-normal mt-0 mb-2">
			{profile?.bio || ''}
		</div>
	{/if}
	<div class="pt-4">
		{#if profile?.website}
			<div class="flex gap-2 justify-center p-4">
				<IconLink />
				<a class="link link-info" href={profile?.website} target="_blank" rel="noreferrer"
					>{profile?.website || ''}</a>
			</div>
		{/if}
		<div class="flex gap-2 justify-center">
			{#if profile?.category?.length}
				{#each profile.category as category}
					<div class="tooltip" data-tip={category}>
						<img src={$category_list[category]} alt="" class="h-7 w-7 m-1" />
					</div>
				{/each}
			{:else}
				<CategoryLoader />
			{/if}
		</div>
	</div>
</div>
