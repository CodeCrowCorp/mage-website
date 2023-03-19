<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'
	import StreamControls from '$lib/components/Channel/Stream/StreamControls.svelte'
	import DropdownViewers from '$lib/components/Channel/Stream/DropdownViewers.svelte'
	import VideoGrid from '$lib/components/Channel/Stream/VideoGrid.svelte'
	export let count: number = 10
</script>

<div class="flex justify-center h-full">
	<div class="carousel carousel-vertical rounded-lg bg-base-100 w-full m-5 mb-24">
		<!-- {#each} -->
		<div class="carousel-item h-full p-3">
			<div>
				<div class="flex gap-2 mb-3">
					<span
						class="btn-sm bg-red-700 rounded-md font-medium text-white border-none flex items-center">
						LIVE
					</span>
					<div class="dropdown dropdown-bottom">
						<label
							class="btn btn-sm rounded-md font-medium gap-2 text-white border-none"
							tabindex="0">
							<IconViewers />
							{count}
						</label>
						<DropdownViewers />
					</div>
				</div>
				<VideoGrid />
			</div>
		</div>
		<!-- {/each} -->
	</div>

	<div class="absolute bottom-0 m-5">
		<StreamControls />
	</div>
</div>
