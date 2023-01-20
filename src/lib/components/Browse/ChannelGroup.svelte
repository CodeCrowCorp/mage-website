<script lang="ts">
	import IconDrawerLeft from '$lib/assets/icons/drawer/IconDrawerLeft.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import IconPlay from '$lib/assets/icons/IconPlay.svelte'
	import { goto } from '$app/navigation'

	export let title: string = '',
		channels: any = undefined

	let ref: any
	$: channels = channels && channels.splice(0, 10)

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
	{#if channels && channels.length}
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
					<div class="flex flex-col shrink-0 first:pl-8 last:pr-8 basis-[400px] rounded-md">
						<div class="relative">
							<div class="video-thumbnail" on:click|preventDefault={() => goto('/channel/1')}>
								{#if channel.thumbnail}
									<div
										class="video-thumbnail"
										style="background-image: url({channel.thumbnail}); background-size: 100%" />
								{/if}
								{channel.thumbnail ? '' : channel.title}
							</div>

							<div class="absolute top-0 w-full h-full opacity-0 hover:opacity-100 cursor-pointer">
								<div class="flex h-full justify-center items-center">
									<IconPlay />
								</div>
							</div>
						</div>
						<div class="flex flex-row gap-5 max-w-[400px]">
							<div class="avatar my-3 ml-2">
								<div class="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
									<img src={channel.avatar} alt="" />
								</div>
							</div>

							<div class="truncate">
								<p class="text-lg font-semibold">{channel.title}</p>
								<p class="text-sm text-gray-600">{channel.description}</p>
							</div>
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
	{:else}
		<div role="status" class="flex flex-row gap-6 animate-pulse">
			<div class="h-64 bg-gray-200 dark:bg-gray-700 w-[400px] mb-4" />
			<div class="h-64 bg-gray-200 dark:bg-gray-700 w-[400px] mb-4" />
			<div class="h-64 bg-gray-200 dark:bg-gray-700 w-[400px] mb-4" />
			<div class="h-64 bg-gray-200 dark:bg-gray-700 w-[400px] mb-4" />

			<span class="sr-only">Loading...</span>
		</div>
	{/if}
</div>

<style>
	.video-thumbnail {
		@apply bg-slate-400 w-full h-64 flex items-center justify-center text-white rounded-md cursor-pointer;
	}
	.item-content::-webkit-scrollbar {
		display: none;
	}
</style>
