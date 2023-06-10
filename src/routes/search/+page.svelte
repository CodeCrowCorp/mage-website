<script lang="ts">
	import { get } from '$lib/api'
	import { page } from '$app/stores'
	import { getSectionUrl } from '$lib/utils'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import { onMount } from 'svelte'
	import LastItemInViewport from '$lib/actions/LastItemInViewport'
	import ItemSearchChannel from '$lib/components/Search/ItemSearchChannel.svelte'
	import LoadingItemSearchChannel from '$lib/components/Search/LoadingItemSearchChannel.svelte'
	import ItemSearchUser from '$lib/components/Search/ItemSearchUser.svelte'
	import LoadingItemSearchUser from '$lib/components/Search/LoadingItemSearchUser.svelte'
	// @ts-ignore
	import NProgress from 'nprogress'
	$: {
		if (isLoading) {
			NProgress.start()
		} else {
			NProgress.done()
		}
	}

	let sectionId = $page.url.searchParams.get('section') || ''
	let query = $page.url.searchParams.get('query') || ''

	let title = '',
		skip = 0,
		limit = 10,
		isLoading = false,
		searchList: any[] = [],
		placeholderText = 'channels',
		initialLoad = true

	const loadMore = async () => {
		isLoading = true
		const url = getSectionUrl({ sectionId, query, skip, limit })
		const moreChannels = await get(`${url}&userId=${$page.data.user?.userId}`, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		searchList = skip === 0 ? moreChannels : [...searchList, ...moreChannels]
		skip += limit
		isLoading = false
	}

	onMount(async () => {
		switch (sectionId) {
			case 'weekly':
				title = `Weekly`
				break
			case 'highest-ranked':
				title = `Highest ranked`
				placeholderText = 'users'
				break
			case 'rising-stars':
				title = `Rising stars`
				placeholderText = 'users'
				break
			case 'my':
				title = `My channels`
				break
			case 'fav':
				title = `Fav channels`
				break
		}
		await loadMore()
		initialLoad = false
	})

	const resetSkipLimit = () => {
		skip = 0
		limit = 10
	}
</script>

<div class="px-9 py-9 md:px-24">
	<div class="flex flex-col md:flex-row gap-4 pb-10">
		<div class="flex flex-col md:flex-row gap-4">
			<form on:submit|preventDefault={loadMore}>
				<div class="form-control">
					<div class="input-group relative">
						<input
							name="query"
							bind:value={query}
							type="search"
							placeholder="Search {placeholderText}"
							class="input input-bordered input-primary w-96" />
						<button
							class="btn btn-square btn-neutral text-white"
							on:click={() => {
								resetSkipLimit()
								loadMore()
							}}>
							<IconSearch />
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>

	{#if title}
		<div class="font-semibold py-5">
			<a class="link link-secondary text-lg">{title}</a>
		</div>
	{/if}

	<div class="flex flex-col gap-4 justify-around">
		{#if initialLoad}
			{#each Array(10) as _}
				{#if placeholderText === 'users'}
					<LoadingItemSearchUser />
				{:else}
					<LoadingItemSearchChannel />
				{/if}
			{/each}
		{:else}
			{#each searchList as item}
				{#if placeholderText === 'users'}
					<ItemSearchUser {item} />
				{:else}
					<ItemSearchChannel {item} />
				{/if}
			{:else}
				<h2>No {placeholderText} found</h2>
			{/each}
			<span use:LastItemInViewport on:loadMore={loadMore} />
		{/if}
	</div>
</div>
