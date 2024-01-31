<script lang="ts">
	import IconInfo from '$lib/assets/icons/IconInfo.svelte'
	import { onMount } from 'svelte'
	import { category_assets, category_list } from '$lib/stores/channelStore'

	export let showAddCategory: boolean = true,
		categories: any = [],
		classes: string = ''

	let maxCategory = 4,
		tabs = ['Game', 'Dev'],
		activeTab = 'Game',
		assetIcons: any = {},
		allIcons: any = {},
		searchQuery: string = '',
		searchResult: any = {},
		renderingAssets: Array<[string, string]>

	const setActiveIcons = () => {
		assetIcons = activeTab == 'Game' ? $category_assets.game : $category_assets.dev
	}

	const setActiveTab = async (tab: string) => {
		activeTab = tab
		setActiveIcons()
	}

	$: allIcons = { ...$category_assets.dev, ...$category_assets.game }
	$: maxCategoryLabel = categories.length == maxCategory ? 'max reached' : 'max ' + maxCategory
	$: renderingAssets = searchQuery != '' ? Object.entries(searchResult) : Object.entries(assetIcons)

	const toggleCategory = (name: string) => {
		if (categories.includes(name)) {
			categories.splice(categories.indexOf(name), 1)
		} else if (categories.length < maxCategory) {
			categories.push(name)
		}
		categories = categories
	}

	const removeCategory = (image_url: string) => {
		let key = Object.keys(allIcons).find((key) => allIcons[key] === image_url)
		toggleCategory(key ?? '')
	}

	const searchCategory = () => {
		// console.log(searchQuery)
		if (searchQuery) {
			searchResult = Object.keys(assetIcons)
				.filter((key) => key.toLowerCase().includes(searchQuery.toLowerCase()))
				.reduce((obj, key) => {
					return Object.assign(obj, {
						[key]: assetIcons[key]
					})
				}, {})
		}
	}

	onMount(async () => {
		await setActiveTab(activeTab)
	})
</script>

<div class="flex lg:h-full p-5">
	<div class="bg-base-200 rounded-lg w-80 md:w-[30rem] flex flex-col {classes}">
		<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">Select category</p>
		<div class="flex flex-col p-3 h-full">
			<div class="relative">
				<div class="flex gap-1 input input-primary">
					<div class="flex flex-row gap-2 items-center left-0">
						{#if categories?.length}
							{#each categories as icon}
								<img
									src={$category_list[icon]}
									alt=""
									class="h-5 w-5 cursor-pointer"
									on:click={() => removeCategory(icon)} />
							{/each}
						{/if}
					</div>

					<input
						type="text"
						bind:value={searchQuery}
						on:input={() => searchCategory()}
						name=""
						class="grow md:ml-4 md:mr-12 focus:outline-0 max-w-[8rem] bg-base-100 md:max-w-xs"
						placeholder={categories?.length ? '' : 'Category'}
						autocomplete="off" />
				</div>
				<span class="absolute right-0 top-1/4 text-gray-400 pr-3">({maxCategoryLabel})</span>
			</div>

			<div class="tabs tabs-boxed mt-5">
				{#each tabs as tab}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span class="tab" class:tab-active={activeTab == tab} on:click={() => setActiveTab(tab)}
						>{tab}</span>
				{/each}
			</div>

			<div class="flex flex-col grow h-80 overflow-y-scroll mt-5">
				{#if renderingAssets.length}
					{#each renderingAssets as [name, image_url]}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="cursor-pointer flex items-center gap-2 pb-2"
							on:click={() => toggleCategory(name)}>
							<input
								type="checkbox"
								checked={categories.includes(name)}
								class="checkbox checkbox-primary"
								disabled={categories.length === maxCategory && !categories.includes(name)} />
							<img src={image_url} alt="" class="h-7 w-7 m-1" />
							<span class="label-text">{name}</span>
						</div>
					{/each}
				{:else if searchQuery != ''}
					<div class="alert flex justify-center">
						<IconInfo />
						<p>No results for the search query</p>
					</div>
				{:else}
					<div class="flex justify-center w-full">
						<progress class="progress w-full" />
					</div>
				{/if}
			</div>
		</div>

		<div class="flex flex-row mt-auto gap-2 p-3">
			<button
				type="button"
				class="btn btn-neutral grow"
				on:click={() => ((categories = []), (showAddCategory = false))}>Cancel</button>
			<button type="button" class="btn btn-primary grow" on:click={() => (showAddCategory = false)}
				>Add</button>
		</div>
	</div>
</div>
