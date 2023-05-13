<script lang="ts">
	import IconDrawerLeft from '$lib/assets/icons/drawer/IconDrawerLeft.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import ItemUser from '$lib/components/Browse/Sections/ItemUser.svelte'
	import LoadingItemChannel from '$lib/components/Browse/Sections/LoadingItemChannel.svelte'

	export let title: string = '',
		users: any = undefined,
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

{#await users}
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
	{#if value.length > 0}
		<div class="flex flex-col my-4 relative overflow-x-auto scrollbar-hide">
			<div class="font-semibold m-3">
				<a class="link link-secondary text-lg" href="/search?section={sectionId}">{title}</a>
			</div>
			<div class="flex flex-row">
				<div class="relative flex items-center ml-3">
					<div class="absolute btn btn-square p-2 left-0 z-10" on:click={prev}>
						<IconDrawerLeft />
					</div>
				</div>

				<div
					bind:this={ref}
					class="relative w-full flex gap-6 snap-x scrollbar-hide snap-mandatory overflow-x-auto flex-grow mx-14">
					{#if sectionId === 'rising-stars'}
						{#each value.users as user}
							<ItemUser {user} />
						{/each}
					{:else}
						{#each value as user}
							<ItemUser {user} />
						{/each}
					{/if}
				</div>

				<div class="relative flex items-center mr-3">
					<div class="absolute btn btn-square p-2 right-0 z-10" on:click={next}>
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
