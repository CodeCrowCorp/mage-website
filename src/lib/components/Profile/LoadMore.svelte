<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import IconSearch from '$lib/assets/icons/IconSearch.svelte'
	import { createEffect } from '$lib/utils'

	export let dataSource: any
	export let searchDataSource: any
	export let inputPlaceholder: string = ''
	export let limit = 10
	export let s_limit = 10
	export let count: any

	const useOueryEffect = createEffect()

	let listElement: any
	let skip = 0
	let sSkip = 0
	let list: any[] = []
	let sList: any = null
	let loading = false
	let allLoaded = false
	let sAllLoaded = false
	let query = ''

	onMount(async () => {
		if (listElement) {
			listElement.addEventListener('scroll', async () => {
				if (listElement.scrollTop + listElement.clientHeight >= listElement.scrollHeight) {
					if (dataSource && !loading && !allLoaded) {
						loading = true
						if (query) {
							if (!sAllLoaded) {
								sSkip += s_limit
								let resp = await searchDataSource(query, sSkip, s_limit)
								sAllLoaded = resp.length === 0
								sList = [...sList, ...resp]
							}
						} else {
							skip += limit
							let resp = await dataSource(skip, limit)
							allLoaded = resp.length === 0
							list = [...list, ...resp]
						}
						loading = false
					}
				}
			})
		}
	})

	const search = async () => {
		loading = true
		sAllLoaded = false
		sList = []
		sSkip = 0
		sList = await searchDataSource(query, sSkip, s_limit)
		sAllLoaded = sList.length < s_limit ? true : false
		loading = false
	}

	onDestroy(() => {
		listElement?.removeEventListener('scroll', () => {})
	})

	$: useOueryEffect(() => {
		if (!query) {
			sList = null
		}
	}, [query])

	$: useOueryEffect(async () => {
		if (count === 0) {
			list = []
			return
		}
		query = ''
		sList = null
		skip = 0
		loading = true
		list = await dataSource(skip, limit)
		allLoaded = list.length < limit ? true : false
		loading = false
	}, [count])

	$: main_list = sList || list
</script>

<div>
	<div class="input-group relative mb-2">
		<input
			name="query"
			bind:value={query}
			type="search"
			placeholder={inputPlaceholder}
			class="input input-bordered input-primary w-full"
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					search()
				}
			}}
			disabled={loading} />
		<button disabled={loading} on:click={search} class="btn btn-square btn-neutral text-white">
			<IconSearch />
		</button>
	</div>
	<div class="h-72 overflow-y-auto" bind:this={listElement}>
		<slot list={main_list} />
		{#if loading}
			<div>
				<progress class="progress w-56" />
			</div>
		{:else if !main_list.length}
			<div class="text-center p-2 text-white">No Data Found</div>
		{/if}
	</div>
</div>
