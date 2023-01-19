<script lang="ts">
	import IconDrawerLeft from '$lib/assets/icons/drawer/IconDrawerLeft.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import { goto } from '$app/navigation'

	export let title: string = ''

	let ref: any
	const channels = ['audio', 'video', 'video more', 'game']

	const prev = () => {
		if (ref) {
			ref.scrollTo({
				left: ref.scrollLeft - 400,
				behavior: 'smooth'
			})
		}
	}

	const next = () => {
		if (ref) {
			ref.scrollTo({
				left: ref.scrollLeft + 400,
				behavior: 'smooth'
			})
		}
	}
</script>

<div class="flex flex-col my-4">
	<div class="font-semibold my-3">{title || 'Channel Group'}</div>
	<div class="flex flex-row">
		<div class="relative flex items-center">
			<div class="absolute bg-white rounded-full p-2 left-0 z-10 cursor-pointer" on:click={prev}>
				<IconDrawerLeft />
			</div>
		</div>

		<div
			bind:this={ref}
			class="item-content relative w-full flex gap-6 snap-x snap-mandatory overflow-x-auto flex-grow">
			{#each channels as channel}
				<div class="shrink-0 first:pl-8 last:pr-8 basis-[400px] rounded-md">
					<div class="video-thumbnail" on:click|preventDefault={() => goto('/channel/1')}>
						{channel}
					</div>
				</div>
			{/each}
		</div>

		<div class="relative flex items-center">
			<div class="absolute bg-white rounded-full p-2 right-0 z-10 cursor-pointer" on:click={next}>
				<IconDrawerChevron />
			</div>
		</div>
	</div>
</div>

<style>
	.video-thumbnail {
		@apply bg-slate-400 w-full h-64 flex items-center justify-center text-white rounded-md cursor-pointer;
	}
	.item-content::-webkit-scrollbar {
		display: none;
	}
</style>
