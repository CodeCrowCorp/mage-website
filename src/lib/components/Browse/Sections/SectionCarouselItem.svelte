<script lang="ts">
	import IconViewers from '$lib/assets/icons/IconViewers.svelte'

	export let channel: any = {}

	let bg_cover = channel.thumbnail || '/src/lib/assets/placeholder/programming-placeholder.jpg'
</script>

<a
	class="swiper-slide bg-slate-50 cursor-pointer rounded-md"
	href="/channel/{channel._id}"
	style="background-image: url({bg_cover});">
	<div class="flex flex-col justify-between p-3 w-full h-full">
		<div class="flex gap-2 mb-3">
			<span
				class="btn btn-sm rounded-md font-medium text-white border-none flex items-center bg-red-700 hover:bg-red-700">
				LIVE
			</span>
			<div class="dropdown dropdown-bottom">
				<label
					for=""
					class="btn btn-sm rounded-md font-medium gap-2 text-white border-none"
					tabindex="-1">
					<IconViewers /> 10
				</label>
			</div>
		</div>

		<div class="flex flex-row items-center gap-2">
			<div class="avatar">
				<div class="w-14 mask mask-squircle">
					<img src={channel.avatar} alt="" />
				</div>
			</div>
			<div class="w-full">
				<p class="text-2xl truncate text-white font-semibold">{channel.title || ''}</p>
				<p class="truncate text-white">
					{channel.username ? '@' + channel.username : channel.displayName || ''}
				</p>
			</div>
		</div>
	</div>
</a>

<style>
	.video-thumbnail {
		@apply w-full h-full;
	}
</style>
