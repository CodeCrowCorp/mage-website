<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import StreamControls from '$lib/components/Channel/StreamControls.svelte'
	export let count: number = 10
</script>

<div class="flex justify-center h-full">
	<div class="carousel carousel-vertical rounded-lg bg-base-100 w-full m-5 mb-24">
		<div class="flex gap-2 p-3">
			<span
				class="btn-sm bg-red-700 rounded-md font-medium text-white border-none flex items-center">
				LIVE
			</span>
			<button class="btn btn-sm rounded-md font-medium gap-2 text-white border-none">
				<IconViewers />
				{count}
			</button>
		</div>
		<!-- {#each} -->
		<!-- <div class="carousel-item h-full">
			<img src="/images/stock/photo-1559703248-dcaaec9fab78.jpg" />
		</div>
		<div class="carousel-item h-full">
			<img src="/images/stock/photo-1565098772267-60af42b81ef2.jpg" />
		</div> -->
		<!-- {/each} -->
	</div>

	<!-- <video></video> -->

	<div class="absolute bottom-0 m-5">
		<StreamControls />
	</div>
</div>
