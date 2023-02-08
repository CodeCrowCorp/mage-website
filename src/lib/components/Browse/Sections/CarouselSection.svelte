<script lang="ts">
	import IconDrawerLeft from '$lib/assets/icons/drawer/IconDrawerLeft.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import { goto } from '$app/navigation'
	import LoadingCarouselItem from '$lib/components/Browse/Sections/LoadingCarouselItem.svelte'
	import { onMount } from 'svelte'
	import Swiper, { Navigation } from 'swiper'

	import 'swiper/css'

	export let channels: any = undefined

	let swiper: Swiper

	$: channels = channels.splice(0, 6)

	onMount(() => {
		swiper = new Swiper('.carousel', {
			slidesPerView: 3,
			spaceBetween: 15,
			loop: true,
			modules: [Navigation],
			navigation: {
				nextEl: '.btn-next',
				prevEl: '.btn-prev'
			},
			breakpoints: {
				320: {
					slidesPerView: 1
				},
				480: {
					slidesPerView: 2
				},
				800: {
					slidesPerView: 3
				}
			}
		})
	})
</script>

{#if !channels.error}
	<div class="relative p-1" class:hidden={channels != undefined && channels.length == 0}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="bg-base-200 rounded-full p-3 btn-prev absolute top-2/4 left-1 z-10 cursor-pointer">
			<IconDrawerLeft />
		</div>

		{#if channels && channels.length}
			<div class="swiper carousel mt-10">
				<div class="swiper-wrapper">
					{#each channels as channel}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="swiper-slide flex cursor-pointer rounded-md"
							on:click|preventDefault={() => goto(`/channel/${channel._id}`)}>
							<div class="flex flex-row items-end w-3/4">
								<div class="avatar my-3 ml-2">
									<div class="w-14 rounded-full">
										<img src={channel.avatar} alt="" />
									</div>
								</div>
								<div class="mb-2 ml-2 w-full">
									<p class="text-2xl truncate font-semibold">{channel.title}</p>
									<p class="truncate">{channel.description}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div role="status" class="flex flex-row gap-1 animate-pulse">
				{#each Array(5) as _, index (index)}
					<LoadingCarouselItem />
				{/each}
				<span class="sr-only">Loading...</span>
			</div>
		{/if}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="bg-base-200 z-10 rounded-full p-3 btn-next absolute top-2/4 right-1 cursor-pointer">
			<IconDrawerChevron />
		</div>
	</div>
{/if}

<style>
	.swiper-slide {
		background: #fff;
		display: flex;
	}
	:global(.swiper-slide) {
		height: 20rem !important;
	}
</style>
