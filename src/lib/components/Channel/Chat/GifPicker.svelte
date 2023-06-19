<script lang="ts">
	import { onMount } from 'svelte'
	import IconChatGif from '$lib/assets/icons/chat/IconChatGif.svelte'
	import { clickOutside } from '../../../utils.js';

	import { get } from '../../../api.js'

	export let onSelect: any

	let btn: any
	let isFocused = false

	let gifs:{ downsized_large: string, original: string, title: string }[] = []
	let searched:{ downsized_large: string, original: string, title: string }[] = []
	let query:string =""
	let loading = false

	onMount(async () => {
		loading = true
		const resp = await get("giphy/trending")
		if(resp && Array.isArray(resp))
			gifs = resp
		loading  = false

		if(btn){
			btn.addEventListener("focus", () => {
				isFocused = true
			})
		}
	})

	const handleClickOutside = () =>{
		isFocused = false
	}

	const openPicker = () => {
		isFocused = true
	}

	const onSearch = async(evt: any) => {
		query = evt.target.value
		loading = true
		const resp = await get("giphy/search?query=" + query)
		loading  = false
		if(resp && Array.isArray(resp))
			searched = resp
	}

	$: btnClass = isFocused ? "btn-primary" : "btn-neutral"
	$: dropdownClass = isFocused ? "dropdown-open" : ""
	$: list = query ? searched : gifs

</script>

<div use:clickOutside={handleClickOutside} class={"dropdown dropdown-top " + dropdownClass}>
	<button
		bind:this={btn}
		type="button"
		class={"btn text-white border-none tooltip font-normal normal-case " + btnClass}
		data-tip="GIF"
		on:click={openPicker}
	>
		<IconChatGif />
		<span class="sr-only">Add GIF</span>
	</button>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		class={'dropdown-content menu shadow bg-base-100'} >
		<div class="gif-picker bg-white flex flex-col rounded-md px-2">
			<div class="m-2">
				<input 
					type="text" 
					placeholder="Search here" 
					class="input input-bordered input-sm w-full max-w-xs" 
					on:input={onSearch}
				/>
			</div>
			
			{#if loading}
				<div class="flex items-center justify-center py-4 w-full">
					<span class="loading loading-dots loading-sm"></span>
				</div>
			{:else}
				{#if list.length}
					<div class="grid grid-cols-4 gap-2 flex-1 overflow-auto mt-2">
						{#each list as gif}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div 
								class="border cursor-pointer" 
								on:click={() => {
									onSelect(gif.downsized_large)
									isFocused = false
								}}>
								<img src={gif.downsized_large} alt="gif" class="w-full" />
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex items-center justify-center py-4 w-full">
						<span class="text-sm text-neutral">No Items Found</span>
					</div>
				{/if}
			{/if}
		
		</div>
		
	</div>
</div>

<style global>
	.gif-picker {
		margin-left: -130px;
		width: 350px;
		height: 400px;
	}
</style>
