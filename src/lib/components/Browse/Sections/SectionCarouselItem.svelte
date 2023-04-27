<script lang="ts">
	export let channel: any = {}
</script>

<a class="swiper-slide bg-slate-50 !flex cursor-pointer rounded-md" href="/channel/{channel._id}">
	<div class="flex flex-row items-end w-3/4">
		<div class="avatar my-3 ml-2">
			<div class="w-14 mask mask-squircle">
				<img src={channel.avatar} alt="" />
			</div>
		</div>
		<div class="mb-2 ml-2 w-full">
			<p class="text-2xl truncate font-semibold">{channel.title}</p>
			<p class="truncate">{channel.description}</p>
		</div>
	</div>
</a>

<style>
	.video-thumbnail {
		@apply w-full h-64 flex items-center justify-center mb-2;
	}
</style>
