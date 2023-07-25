<script lang="ts">
	import IconDrawerLeft from '$lib/assets/icons/drawer/IconDrawerLeft.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import LoadingItemChannel from '$lib/components/Browse/Sections/LoadingItemChannel.svelte'
	import ItemChannel from '$lib/components/Browse/Sections/ItemChannel.svelte'

	export let title: string = '',
		channels: any = undefined,
		sectionId: string = ''

	let ref: any

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

{#await channels}
	<div class="flex flex-col my-4 relative overflow-x-auto scrollbar-hide">
		<div class="font-semibold m-3">
			<div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 animate-pulse" />
		</div>
		<div role="status" class="flex flex-row gap-1 animate-pulse">
			{#each Array(6) as _, index (index)}
				<LoadingItemChannel />
			{/each}
		</div>
	</div>
{:then value}
	{#if sectionId === 'weekly' ? value.channels?.length > 0 : value.length > 0}
		<div class="flex flex-col relative overflow-x-auto scrollbar-hide">
			<div class="font-semibold mt-3 mx-3">
				<a class="link link-secondary text-lg" href="/search?section={sectionId}"
					>{sectionId === 'weekly' ? value.title : title}</a>
			</div>
			<div class="flex flex-row">
				<div class="relative flex items-center ml-3">
					<div
						class="absolute btn btn-neutral btn-prev btn-square text-white p-2 left-0 z-10"
						on:click={prev}>
						<IconDrawerLeft />
					</div>
				</div>

				<div
					bind:this={ref}
					class="relative w-full flex gap-6 snap-x scrollbar-hide snap-mandatory overflow-x-auto flex-grow mx-14">
					{#if sectionId === 'weekly'}
						{#each value.channels as channel}
							<ItemChannel {channel} />
						{/each}
					{:else}
						{#each value as channel}
							<ItemChannel {channel} />
						{/each}
					{/if}
				</div>

				<div class="relative flex items-center mr-3">
					<div
						class="absolute btn btn-neutral btn-next btn-square text-white p-2 right-0 z-10"
						on:click={next}>
						<IconDrawerChevron />
					</div>
				</div>
			</div>
		</div>
	{/if}
{/await}

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* For IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
