<script lang="ts">
	import IconDrawerLeft from '$lib/assets/icons/drawer/IconDrawerLeft.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
	import LoadingItemCarousel from '$lib/components/Browse/Sections/LoadingItemCarousel.svelte'
	import { onMount } from 'svelte'
	import Swiper, { Navigation } from 'swiper'
	import ItemCarousel from '$lib/components/Browse/Sections/ItemCarousel.svelte'
	import 'swiper/css'

	export let channels: any = []

	let swiper: Swiper

	const initSwiper = () => {
		swiper = new Swiper('.carousel', {
			slidesPerView: 3,
			spaceBetween: 15,
			loop: true,
			centeredSlides: true,
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
	}

	onMount(async () => {
		initSwiper()
	})
</script>

{#if channels.length == 0}
	<div class="flex flex-col my-4 relative overflow-x-auto scrollbar-hide">
		<div role="status" class="flex flex-row gap-1 animate-pulse">
			{#each Array(5) as _, index (index)}
				<LoadingItemCarousel />
			{/each}
		</div>
	</div>
{:else}
	<div class="relative p-1">
		<div class="btn btn-square p-2 btn-prev absolute top-2/4 left-1 z-10 ml-3">
			<IconDrawerLeft />
		</div>
		<div class="swiper carousel !pt-10 mx-8">
			<div class="swiper-wrapper">
				{#each channels as channel}
					<ItemCarousel {channel} />
				{/each}
			</div>
		</div>
		<div class="btn btn-square z-10 p-2 btn-next absolute top-2/4 right-1 mr-3">
			<IconDrawerChevron />
		</div>
	</div>
{/if}

<style>
	:global(.swiper-slide) {
		height: 20rem !important;
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* For IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
