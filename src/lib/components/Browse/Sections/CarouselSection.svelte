<script lang="ts">
	import IconDrawerLeft from '$lib/assets/icons/drawer/IconDrawerLeft.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import { goto } from '$app/navigation'
	import LoadingCarouselItem from '$lib/components/Browse/Sections/LoadingCarouselItem.svelte'

	export let channels: any = []

	let ref: any,
		showback = false

	$: channels = channels

	const prev = () => {
		if (ref) {
			showback = ref.scrollLeft > 500
			ref.scrollTo({
				left: ref.scrollLeft - 500,
				behavior: 'smooth'
			})
		}
	}

	const next = () => {
		if (ref) {
			showback = true
			ref.scrollTo({
				left: ref.scrollLeft + 500,
				behavior: 'smooth'
			})
		}
	}
</script>

{#if !channels.error}
	<div class="relative">
		<!-- {#if showback} -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="bg-base-200 rounded-full p-3 absolute top-2/4 left-1 z-10 cursor-pointer"
			on:click={prev}>
			<IconDrawerLeft />
		</div>
		<!-- {/if} -->
		<div
			bind:this={ref}
			class="carousel-content relative w-full flex gap-6 snap-x snap-mandatory overflow-x-auto pt-14 flex-grow">
			{#if channels && channels.length}
				<div class="shrink-0 blank-width" />
				{#each channels as channel}
					<div class="snap-center shrink-0 first:pl-8 last:pr-8 w-[400px] md:w-[600px] rounded-md">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="video-thumbnail"
							on:click|preventDefault={() => goto(`/channel/${channel._id}`)}>
							<div class="flex flex-row">
								<div class="avatar my-3 ml-2">
									<div class="w-14 rounded-full">
										<img src={channel.avatar} alt="" />
									</div>
								</div>
								<div class="mt-2 ml-2 w-80">
									<p class="text-2xl font-semibold">{channel.title}</p>
									<p class="truncate">{channel.description}</p>
								</div>
							</div>
						</div>
					</div>
				{/each}
				<div class="shrink-0 blank-width" />
			{:else}
				<div role="status" class="flex flex-row gap-1 animate-pulse">
					{#each Array(6) as _, index (index)}
						<LoadingCarouselItem />
					{/each}
					<span class="sr-only">Loading...</span>
				</div>
			{/if}
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="bg-base-200 rounded-full p-3 absolute top-2/4 right-1 cursor-pointer"
			on:click={next}>
			<IconDrawerChevron />
		</div>
	</div>
{/if}

<style>
	.video-thumbnail {
		@apply bg-slate-400 w-full h-80 flex items-end text-white rounded-md cursor-pointer;
	}

	.blank-width {
		width: calc((100% - 600px) / 2);
	}

	.carousel-content::-webkit-scrollbar {
		display: none;
	}
</style>
