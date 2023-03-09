<script lang="ts">
	import IconInfo from '$lib/assets/icons/IconInfo.svelte'
	import { onMount } from 'svelte'
	import { category_assets } from '$lib/stores/channelStore'
	import web2UrlsJson from '$lib/assets/svg-json/web2.json'
	import web3UrlsJson from '$lib/assets/svg-json/web3.json'
	import gameUrlsJson from '$lib/assets/svg-json/game.json'

	export let showAddCategory: boolean = true,
		categories: any = [],
		categoryIcons: any = []

	let maxCategory = 4,
		tabs = ['Game', 'Web2', 'Web3'],
		activeTab = 'Game',
		assetIcons: any = {},
		allIcons: any = {},
		searchQuery: string = '',
		searchResult: any = {},
		renderingAssets: Array<[string, string]>

	const setActiveIcons = () => {
		assetIcons =
			activeTab == 'Game'
				? $category_assets.game
				: activeTab == 'Web2'
				? $category_assets.web2
				: $category_assets.web3
	}

	const loadWeb2 = () => {
		if (!Object.keys($category_assets.web2).length) {
			$category_assets.web2 = web2UrlsJson
		}
	}
	const loadWeb3 = () => {
		if (!Object.keys($category_assets.web3).length) {
			$category_assets.web3 = web3UrlsJson
		}
	}
	const loadGame = () => {
		if (!Object.keys($category_assets.game).length) {
			$category_assets.game = gameUrlsJson
		}
	}

	const setActiveTab = async (tab: string) => {
		activeTab = tab
		// assetIcons = []
		loadWeb2()
		loadGame()
		loadWeb3()
		setActiveIcons()
	}

	$: allIcons = { ...$category_assets.web2, ...$category_assets.web3, ...$category_assets.game }
	$: maxCategoryLabel = categories.length == maxCategory ? 'max reached' : 'max ' + maxCategory
	$: renderingAssets = searchQuery != '' ? Object.entries(searchResult) : Object.entries(assetIcons)

	const toggleCategory = (name: string, image_url: string) => {
		if (categories.includes(name)) {
			categories.splice(categories.indexOf(name), 1)
			categoryIcons.splice(categoryIcons.indexOf(image_url), 1)
		} else if (categories.length < maxCategory) {
			categories.push(name)
			categoryIcons.push(image_url)
		}
		categories = categories
		categoryIcons = categoryIcons
	}

	const removeCategory = (image_url: string) => {
		let key = Object.keys(allIcons).find((key) => allIcons[key] === image_url)
		toggleCategory(key ?? '', image_url)
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

<div class="bg-base-200 w-80 md:w-[30rem] flex flex-col">
	<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">Select category</p>
	<div class="flex flex-col p-3 h-full">
		<div class="relative">
			<div class="flex gap-1 input input-primary">
				<div class="flex flex-row gap-2 items-center left-0">
					{#if categoryIcons.length}
						{#each categoryIcons as icon}
							<img
								src={icon}
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
					placeholder={categoryIcons.length ? '' : 'Categories'}
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
					<label
						class="cursor-pointer flex items-center gap-2 pb-2"
						on:click={() => toggleCategory(name, image_url)}>
						<input
							type="checkbox"
							checked={categories.includes(name)}
							class="checkbox checkbox-primary"
							disabled={categories.length === maxCategory && !categories.includes(name)} />
						<img src={image_url} alt="" class="h-7 w-7 m-1" />
						<span class="label-text">{name}</span>
					</label>
				{/each}
			{:else if searchQuery != ''}
				<div class="alert shadow-lg flex justify-center">
					<IconInfo />

					<p>No results for the search query</p>
				</div>
			{:else}
				<div class="flex justify-center w-full">
					<span class="btn btn-circle btn-outline btn-sm loading" />
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-row mt-auto gap-2 md:mb-4 p-3">
		<button
			type="button"
			class="btn btn-default grow"
			on:click={() => ((categories = []), (categoryIcons = []), (showAddCategory = false))}
			>Cancel</button>
		<button type="button" class="btn btn-primary grow" on:click={() => (showAddCategory = false)}
			>Add</button>
	</div>
</div>

<style>
</style>
