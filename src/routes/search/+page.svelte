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
	import { createEffect } from '$lib/utils'

	// @ts-ignore
	import NProgress from 'nprogress'
	$: {
		if (isLoading) {
			NProgress.start()
		} else {
			NProgress.done()
		}
	}

	const useOueryEffect = createEffect()

	let sectionId = $page.url.searchParams.get('section') || ''
	let queryInUrl = $page.url.searchParams.get('query') || ''
	let query:string = queryInUrl
	let title = '',
		skip = 0,
		limit = 10,
		isLoading = false,
		searchList: any[] = [],
		placeholderText = 'channels',
		initialLoad = true
	let listElement: any
	let allLoaded = false
	let time = Date.now()

	const loadMore = async () => {
		if(isLoading)return
		isLoading = true
		const url = getSectionUrl({ sectionId, query, skip, limit })
		const moreChannels = await get(`${url}&userId=${$page.data.user?.userId}`, {
			userId: $page.data.user?.userId,
			token: $page.data.user?.token
		})
		allLoaded = moreChannels.length === 0
		searchList = searchList.concat(moreChannels) 
		skip += limit
		isLoading = false
	}

	const resetSkipLimit = () => {
		skip = 0
		limit = 10
		allLoaded = false
		searchList = []
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
		if (listElement) {
			listElement.addEventListener('scroll', async () => {
				if (!allLoaded && listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight) {
					loadMore()
				}
			})
		}
	})

	$: useOueryEffect(async () => {
		initialLoad = true
		resetSkipLimit()
		await loadMore()
		initialLoad = false
		time = Date.now()
	}, [$page.url])

</script>

<div bind:this={listElement}  class="px-9 py-9 md:px-24 flex flex-col h-screen overflow-auto">
	<div class="flex flex-col md:flex-row gap-4 pb-10 sticky top-0 z-10">
		<div class="flex flex-col md:flex-row gap-4">
			<form action="/search">
				<div class="form-control">
					<div class="input-group relative">
						<input
							name="query"
							bind:value={query}
							type="search"
							placeholder="Search {placeholderText}"
							class="input input-bordered input-primary w-96" />
						<input type="hidden" name="time" value={time}/>
						{#if sectionId}
							<input type="hidden" name="section" value={sectionId}/>
						{/if}
						<button
							class="btn btn-square btn-neutral text-white"
						>
							<IconSearch />
						</button>
					</div>
				</div>
			</form>
		</div>

		{#if title}
			<div class="font-semibold py-5">
				<a class="link link-secondary text-lg">{title}</a>
			</div>
		{/if}
	</div>

	

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
		{#if isLoading}
			<progress class="progress w-full" />
		{/if}
	</div>
</div>
