<script lang="ts">
	import StreamControls from '$lib/components/Channel/StreamControls.svelte'
</script>

<div class="flex justify-center">
	<div class="carousel carousel-vertical rounded-lg bg-slate-50 w-full h-96 m-5">
		<div class="carousel-item h-full">
			<img src="/images/stock/photo-1559703248-dcaaec9fab78.jpg" />
		</div>
		<div class="carousel-item h-full">
			<img src="/images/stock/photo-1565098772267-60af42b81ef2.jpg" />
		</div>
	</div>

	<!-- <video></video> -->

	<div class="absolute bottom-0 m-5">
		<StreamControls />
	</div>
</div>
