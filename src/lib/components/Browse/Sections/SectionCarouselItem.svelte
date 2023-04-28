<script lang="ts">
	export let channel: any = {}

	let bg_cover = channel.thumbnail || '/src/lib/assets/placeholder/programming-placeholder.jpg'
</script>

<a
	class="swiper-slide bg-slate-50 cursor-pointer rounded-md"
	href="/channel/{channel._id}"
	style="background-image: url({bg_cover});">
	<div class="flex flex-row items-end w-full h-full">
		<div class="flex flex-row items-center gap-2 ml-2 mb-2">
			<div class="avatar">
				<div class="w-14 mask mask-squircle">
					<img src={channel.avatar} alt="" />
				</div>
			</div>
			<div class="w-full">
				<p class="text-2xl truncate font-semibold">{channel.title || ''}</p>
				<p class="truncate">
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
