<script lang="ts">
	export let channel: any = {}
</script>

<a class="swiper-slide bg-slate-50 !flex cursor-pointer rounded-md" href="/channel/{channel._id}">
	<div class="flex flex-row items-end w-full">
		<div class="flex flex-row items-center gap-2 ml-2 mb-2">
			<div class="avatar">
				<div class="w-14 mask mask-squircle">
					<img src={channel.avatar} alt="" />
				</div>
			</div>
			<div class="w-full">
				<p class="text-2xl truncate font-semibold">{channel.title || ''}</p>
				<p class="truncate">@{channel.username}</p>
			</div>
		</div>
	</div>
</a>

<style>
	.video-thumbnail {
		@apply w-full h-64 flex items-center justify-center mb-2;
	}
</style>
