<script>
	import IconDrawerLeft from '$lib/assets/icons/drawer/IconDrawerLeft.svelte'
	import IconDrawerChevron from '$lib/assets/icons/drawer/IconDrawerChevron.svelte'
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
	<div class="bg-white rounded-full p-3 absolute top-2/4 left z-10">
		<IconDrawerLeft />
	</div>

	<div
		class="carousel-content relative w-full flex gap-6 snap-x snap-mandatory overflow-x-auto pt-14 flex-grow">
		<div class="shrink-0 blank-width" />
		<div class="snap-center shrink-0 first:pl-8 last:pr-8 basis-[600px] rounded-md">
			<div class="video-thumbnail">Video Thumbnail 1</div>
		</div>
		<div class="snap-center shrink-0 first:pl-8 last:pr-8 basis-[600px] rounded-md">
			<div class="video-thumbnail">Video Thumbnail 2</div>
		</div>
		<div class="snap-center shrink-0 first:pl-8 last:pr-8 basis-[600px] rounded-md">
			<div class="video-thumbnail">Video Thumbnail 3</div>
		</div>
		<div class="snap-center shrink-0 first:pl-8 last:pr-8 basis-[600px] rounded-md">
			<div class="video-thumbnail">Video Thumbnail 4</div>
		</div>

		<div class="shrink-0 blank-width" />
	</div>

	<div class="bg-white rounded-full p-3 absolute top-2/4 right">
		<IconDrawerChevron />
	</div>
</div>

<style>
	.video-thumbnail {
		@apply bg-slate-400 w-full h-80 flex items-center justify-center text-white rounded-md;
	}

	.right {
		right: max(30px, (100% - 600px) / 2);
	}
	.left {
		left: max(30px, (100% - 600px) / 2);
	}

	.blank-width {
		width: calc((100% - 600px) / 2);
	}

	.carousel-content::-webkit-scrollbar {
		display: none;
	}
</style>
