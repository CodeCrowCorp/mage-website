<script lang="ts">
	import { IconDrawerLeft, IconDrawerChevron } from '$lib/utils/icons'
	import { goto } from '$app/navigation'

	export let channels: any = []

	let ref: any,
		showback = false

	$: channels = channels && channels.splice(0, 5)

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

<!-- <div class="carousel w-full">
	<div id="slide1" class="carousel-item relative w-full">
		<img src="https://placeimg.com/800/200/arch" class="w-full" />
		<div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
			<a href="#slide4" class="btn btn-circle">❮</a>
			<a href="#slide2" class="btn btn-circle">❯</a>
		</div>
	</div>
	<div id="slide2" class="carousel-item relative w-full">
		<img src="https://placeimg.com/800/200/arch" class="w-full" />
		<div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
			<a href="#slide1" class="btn btn-circle">❮</a>
			<a href="#slide3" class="btn btn-circle">❯</a>
		</div>
	</div>
	<div id="slide3" class="carousel-item relative w-full">
		<img src="https://placeimg.com/800/200/arch" class="w-full" />
		<div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
			<a href="#slide2" class="btn btn-circle">❮</a>
			<a href="#slide4" class="btn btn-circle">❯</a>
		</div>
	</div>
	<div id="slide4" class="carousel-item relative w-full">
		<img src="https://placeimg.com/800/200/arch" class="w-full" />
		<div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
			<a href="#slide3" class="btn btn-circle">❮</a>
			<a href="#slide1" class="btn btn-circle">❯</a>
		</div>
	</div>
</div> -->
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
			<div
				role="status"
				class="w-full max-w-lg h-80 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
				<span class="sr-only">Loading...</span>
			</div>

			<div
				role="status"
				class="w-full max-w-lg h-80 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
				<span class="sr-only">Loading...</span>
			</div>

			<div
				role="status"
				class="hidden md:block w-full max-w-lg h-80 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
				<span class="sr-only">Loading...</span>
			</div>
		{/if}
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="bg-base-200 rounded-full p-3 absolute top-2/4 right-1 cursor-pointer" on:click={next}>
		<IconDrawerChevron />
	</div>
</div>

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
