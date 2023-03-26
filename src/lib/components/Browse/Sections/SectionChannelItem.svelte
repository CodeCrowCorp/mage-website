<script lang="ts">
	import IconPlay from '$lib/assets/icons/IconPlay.svelte'
	import { goto } from '$app/navigation'

	export let channel: any
</script>

<a
	class="flex flex-col shrink-0 first:pl-8 last:pr-8 w-[300px] md:w-[400px] rounded-md"
	href="/channel/{channel._id}">
	<div class="relative">
		<div class="video-thumbnail" on:click|preventDefault={() => goto(`/channel/${channel._id}`)}>
			{#if channel.thumbnail}
				<div
					class="video-thumbnail"
					style="background-image: url({channel.thumbnail}); background-size: 100%" />
			{/if}
			{channel.thumbnail ? '' : channel.title}
		</div>

		<div class="absolute top-0 w-full h-full opacity-0 hover:opacity-100 cursor-pointer">
			<div class="flex h-full justify-center items-center">
				<IconPlay />
			</div>
		</div>
	</div>
	<div class="flex flex-row gap-5 max-w-[400px]">
		<div class="avatar my-3 ml-2">
			<div class="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
				<img src={channel.avatar} alt="" />
			</div>
		</div>

		<div class="truncate mr-2">
			<p class="text-lg font-semibold">{channel.title}</p>
			<p class="text-sm text-gray-600">{channel.description}</p>
		</div>
	</div>
</a>
