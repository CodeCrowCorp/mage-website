<script lang="ts">
	import StreamControls from '$lib/components/Channel/StreamControls.svelte'
</script>

<div class="flex justify-center h-full">
	<div class="carousel carousel-vertical rounded-lg bg-base-100 w-full m-5 mb-24">
		<!-- {#each} -->
		<div class="carousel-item h-full">
			<img src="/images/stock/photo-1559703248-dcaaec9fab78.jpg" />
		</div>
		<div class="carousel-item h-full">
			<img src="/images/stock/photo-1565098772267-60af42b81ef2.jpg" />
		</div>
		<!-- {/each} -->
	</div>

	<!-- <video></video> -->

	<div class="absolute bottom-0 m-5">
		<StreamControls />
	</div>
</div>
