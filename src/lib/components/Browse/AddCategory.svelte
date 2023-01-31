<script lang="ts">
	import { onMount } from 'svelte'
	import { techList } from '$lib/stores/channelStore'

	// getTechListJson() method already called from +page.svelte in browse
	// so $techList has the value

	export let showAddCategory: boolean = true,
		categories: any = []

	let maxCategory = 4,
		tabs = ['Games', 'Web2', 'Web3'],
		activeTab = 'Games',
		web2Assets = [],
		web3Assets = [],
		gamesAssets = []

	const loadWeb2 = async () => {
		if (web2Assets.length == 0) {
			let res = await fetch(`/svg-json/web2.json`, {
				method: 'GET'
			})
			res.ok ? (web2Assets = await res.json()) : ''
		}
	}
	const loadWeb3 = async () => {
		if (web3Assets.length == 0) {
			let res = await fetch(`/svg-json/web3.json`, {
				method: 'GET'
			})

			res.ok ? (web3Assets = await res.json()) : ''
		}
	}
	const loadGame = async () => {
		if (gamesAssets.length == 0) {
			let res = await fetch(`/svg-json/games.json`, {
				method: 'GET'
			})

			res.ok ? (gamesAssets = await res.json()) : ''
		}
	}

	const setActiveTab = async (tab: string) => {
		activeTab = tab
		loadWeb2()
		loadGame()
		loadWeb3()
	}
	$: maxCategoryLabel = categories.length == maxCategory ? 'max reached' : 'max ' + maxCategory

	const addCategory = (name: string, image_url: string) => {
		if (categories.includes(name)) {
			categories.splice(categories.indexOf(name), 1)
			categories = categories
		} else if (categories.length < maxCategory) {
			categories.push(name)
			categories = categories
		}
	}
</script>

<div class=" addCategory bg-base-200 w-80 md:w-[30rem] flex flex-col">
	<p class="p-3 text-xl mb-5 pb-2 border-purple-500 font-semibold border-b-2">Select category</p>
	<div class="flex flex-col p-3 h-full">
		<div class="relative">
			<input
				bind:value={categories}
				type="text"
				placeholder="Categories"
				class="input input-primary input-bordered mt-5 w-full " />
			<span class="absolute right-0 top-1/2 text-gray-400 pr-3">({maxCategoryLabel})</span>
		</div>

		<div class="tabs tabs-boxed mt-5">
			{#each tabs as tab}
				<a
					class="tab"
					href="#"
					class:tab-active={activeTab == tab}
					on:click={() => setActiveTab(tab)}>{tab}</a>
			{/each}
		</div>

		<div class="flex flex-col grow h-80 overflow-y-scroll mt-5">
			{#if Object.entries($techList).length}
				{#each Object.entries($techList) as [name, image_url]}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<label
						class="cursor-pointer flex items-center gap-2 pb-2"
						on:click={() => addCategory(name, image_url)}>
						<input
							type="checkbox"
							checked={categories.includes(name)}
							class="checkbox checkbox-primary"
							disabled={categories.length == maxCategory && !categories.includes(name)} />
						<img src={image_url} alt="" class="h-7 w-7 m-1" />
						<span class="label-text">{name}</span>
					</label>
				{/each}
			{/if}
		</div>
	</div>

	<div class="flex flex-row mt-auto gap-2 md:mb-4 p-3">
		<button type="button" class="btn btn-default grow" on:click={() => (showAddCategory = false)}
			>Cancel</button>
		<button type="button" class="btn btn-primary grow" on:click={() => (showAddCategory = false)}
			>Add</button>
	</div>
</div>

<style>
</style>
