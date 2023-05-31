<script lang="ts">
	export let user: any = {}
</script>

<a
	class="flex flex-col shrink-0 first:pl-8 last:pr-8 w-[300px] md:w-[400px] rounded-md"
	href="/profile/{user.username}">
	<div class="relative">
		<div class="video-thumbnail">
			<img
				class="w-full h-full mask rounded-lg"
				src={user.banner ? user.banner : '/src/lib/assets/placeholder/gaming-placeholder.jpg'}
				alt="user banner" />
		</div>
	</div>
	<div class="flex flex-row gap-3 max-w-[400px]">
		<div class="avatar">
			<div class="w-12 mask mask-squircle">
				<img src={user.avatar} alt="" />
			</div>
		</div>

		<div class="truncate mr-2">
			<p class="text-lg font-semibold">{user.displayName}</p>
			<p class="text-sm">@{user.username}</p>
		</div>
	</div>
</a>

<style>
	.video-thumbnail {
		@apply w-full h-64 flex items-center justify-center mb-2;
	}
</style>
